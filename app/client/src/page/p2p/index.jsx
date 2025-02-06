import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context.jsx";
import { BuyCredits, SellCredits } from "../../apis/p2p.contracts";
import { generateSellProof, generateBuyProof } from "../../configs/snark.js";
import axios from "axios";
import { updateURI } from "../../apis/auth.contracts.js";
import CryptoJS from "crypto-js";
import { useQuery } from "@apollo/client";
import { GET_LIST, GET_PURCHASE } from "../../graphql/queries";
import jsPDF from "jspdf";
import Cards from "../../components/cards.jsx";
import Navbar from "../../components/navbar.jsx";
import { SocketContext } from "../../context/socket.jsx";
import Dialog from "../../components/dailog.jsx";
import Loader from "../../components/loader.jsx";
import { data, useNavigate } from "react-router";
import io from 'socket.io-client';
import { backendUrl } from "../../configs/constants.js";

const P2P = () => {

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [p2ploading, setp2pLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    price: 420,
    units: 0,
    totalPrice: 0,
  });
  const [dialogProps, setDialogProps] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const context = useContext(Context);
  const { accData, setAccData, isConnected } = context;
  const socketContext = useContext(SocketContext);
  const { socketId , setSocketId} = socketContext;

  const navigate = useNavigate();
  
  // useEffect(()=>{
  //   if(!accData.key || !accData.businessName) {
  //     navigate('/sign-in')
  //   }
  // },[])

  const {
    loading: loadingList,
    error: errorList,
    data: dataList,
    refetch: refetchList,
  } = useQuery(GET_LIST, {
    variables: { first: 100, skip: 0 },
  });
  const {
    loading: loadingPurchase,
    error: errorPurchase,
    data: dataPurchase,
    refetch: refetchPurchase,
  } = useQuery(GET_PURCHASE, {
    variables: { first: 100, skip: 0 },
  });

  useEffect(() => {
    if (loadingList || loadingPurchase) setLoading(true);
    else setLoading("");
  }, [loadingList, loadingPurchase]);

  useEffect(() => {
    if (errorList || errorPurchase) setError(true);
    else setError(false);
  }, [errorPurchase, errorList]);

  useEffect(() => {
    console.log(dataList?.listeds)
    console.log(dataPurchase?.purchaseds)
    if (dataList?.listeds && dataPurchase?.purchaseds) {
      const purchaseIds = dataPurchase?.purchaseds.map((item) => item.listId);

      // Filter objects in dataList that are not in dataPurchase
      const uniqueList = dataList?.listeds.filter(
        (item) => !purchaseIds.includes(item.listId)
      );

      setListings(uniqueList);
    }
  }, [dataList, dataPurchase]);


  useEffect(()=>{
    console.log(socketId)
  },[socketId])

  useEffect(() => {
    const newSocket = io(backendUrl);
    setSocketId(newSocket);
  
    newSocket.on("connect", () => {
      setSocketId(newSocket);
      console.log("Connected to socket:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setSocketId(null);
    });
  
    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected on cleanup");
    };
  },[])

  const handleHashing = (data) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      accData.key
    ).toString();
    return encrypted;
  };

  async function handleIPFSUpdate(change) {
    let data = {
      ...accData,
      carbonCredits: Number(accData.carbonCredits) - Number(change),
      activity: Number(accData.activity) + Number(change),
    };
    setAccData(data);
    console.log(data)
    delete data.key;
    const hashed = handleHashing(data);
    const res = await axios.post(
      "http://localhost:3000/api/v1/company/register",
      { data: hashed },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data.data.cid);
    const transaction = await updateURI({
      data: {
        tokenId: accData.tokenId,
        newUri: res.data.data.cid,
      },
      address: accData.user,
    });
    if (!transaction) return;
  }

  function generateReceipt(res,index) {
    let response = {
      units: listings[index].units,
      date: Date.now(),
      price_per_credit: listings[index].price,
      totalPrice: listings[index].totalPrice,
    };
    const doc = new jsPDF();
    console.log(response)
    const formattedData = JSON.stringify(response, null, 2);
    console.log(formattedData)
    doc.setFont("Courier", "normal");
    doc.text("Receipt Data:", 10, 10);
    doc.text(formattedData, 10, 20);

    doc.save(`receipt-${Date.now()}.pdf`);
  }

  async function handleBuy(index) {
    if(!accData.key) {
      navigate('/sign-in');
      return
    }
    setp2pLoading(true);
    let res = await generateBuyProof({
      balance: accData.carbonCredits || 100,
      units: listings[index].units,
      limit: accData.creditsLimit || 150,
    });
    if (!res){ 
      setp2pLoading(false);
      return;
    }
    res = await BuyCredits({
      listId: listings[index].listId,
      address: accData.user,
      totalPrice: listings[index].totalPrice
    });
    if (!res){ 
      setp2pLoading(false);
      return;
    }
    await handleIPFSUpdate(listings[index].units * -1);
    console.log(res)
    generateReceipt(res, index);
    if (socketId) {
      console.log(socketId)
      socketId.emit(
        "trade",
        `Anonymous bought ${listings[index].units} credits, each for ${listings[index].price}`
      );
    }
    setp2pLoading(false);
  }

  async function handleSell() {
    formData.totalPrice = formData.price * formData.units;
    setp2pLoading(true);
    let res = await generateSellProof({
      balance: accData.carbonCredits || 100,
      units: formData.units,
    });
    if (!res){ 
      setp2pLoading(false)
      return;
    }
    res = await SellCredits({ data: formData, address: accData.user });
    if (!res){ 
      setp2pLoading(false);
      return;
    }
    await handleIPFSUpdate(formData.units);
    setp2pLoading(false);
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <>
      <Navbar />
      {
        p2ploading && 
        <div className="w-[100vw] h-[100vh] z-[200] fixed  h-full flex justify-center items-center">
          <Loader />
        </div>
      }
      {openDialog && (
        <Dialog
          msg={dialogProps.msg}
          closefn={dialogProps.closefn}
          callback={dialogProps.callback}
        />
      )}
      {
        // accData.key &&
        <div
        className="h-screen w-screen p-10 mt-[50px]"
        // style={{ "background-image": `url(${bgimg})` }}
      >
        <div className=" flex flex-col bg-[#1e1e1e] bg-opacity-90 rounded-lg">
          <div className="flex justify-between min-h-[40vw] p-10">
            <div className="justify-center w-[22vw] flex flex-col">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="w-full pr-10"
              >
                <br />
                {/* <label className="text-left">eth:</label>
                <div className="relative w-full pl-1 pr-1">
                </div>
                <input
                  className="w-full m-2 border-[3px] border-[solid] border-whiteborder border-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-700"
                  type="text"
                  name="price"
                  onChange={handleChange}
                /> */}

                <br />
                <label className="text-left">Credits to be Listed:</label>
                <div className="relative w-full pl-1 pr-1">
                  {/* <div className="flex justify-between text-xs text-white">
                    <span>0</span>
                    <span>100</span>
                  </div> */}
                </div>
                <input
                  className="w-full m-2 border-[3px] border-[solid] border-whiteborder border-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-700"
                  type="text"
                  name="units"
                  onChange={handleChange}
                />
                {/* {formData.price} */}
                <br />

                <button
                  type="submit"
                  onClick={() => {
                    if(!accData.key) {
                      navigate('/sign-in')
                      return
                    }
                    setOpenDialog(true);
                    setDialogProps({
                      msg: `Sure to sell ${formData.units} credits for ${formData.price} Gwei each?`,
                      closefn: setOpenDialog,
                      callback: handleSell,
                    });
                  }}
                  className="ml-5 mr-5 h-auto cursor-button border-[0px] border-[solid] border-[rgb(187,204,0)] text-[22px] text-[rgb(255,_255,_255)] px-[30px] py-[10px] [transition:300ms] w-[50%] [box-shadow:rgba(14,_30,_37,_0.12)_0px_2px_4px_0px,_rgba(14,_30,_37,_0.32)_0px_2px_16px_0px] rounded-[50px] bg-[rgb(204,_0,_0)] hover:text-[rgb(255,_255,_255)] hover:w-[60%] hover:bg-[rgb(30,_30,_30)_none_repeat_scroll_0%_0%_/_auto_padding-box_border-box] hover:border-[rgb(255,_255,_255)] hover:border-4 hover:border-solid"
                >
                  SELL
                </button>
              </form>
            </div>

            <div className="h-[70vh] flex overflow-y-auto">
              {loading ? (
                <div className="w-[70vw] flex justify-center items-center">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 col-span-3">
                  {listings.map(({listId, units, price}, index) => (
                    <Cards
                      key={index}
                      uname={index}
                      eth={units}
                      percent={price}
                      handleBuy={handleBuy}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      }
    </>
  );
};
export default P2P;
