import { useContext, useState } from "react";
import { SignInBusiness } from "../../apis/auth.contracts.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/context.jsx";
import CryptoJS from "crypto-js";
import logo from "../../assets/logo.png";
import Dialog from "../../components/dailog.jsx";
import Loader from "../../components/loader.jsx";

const SignIn = () => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const [dialogProps, setDialogProps] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading , setLoading] = useState(false);
  const { setAccData , accData , isConnected} = context;

  const [formData, setFormData] = useState({
    tokenId: 0,
    user: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const [key, setKey] = useState("");

  function handleDecrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      if (!formData.tokenId || !key || !accData.user) return;
      const transaction = await SignInBusiness({ formData:{...formData , user:accData.user} });
      if (!transaction) {
        setDialogProps({
          msg:"Could not Sign-in",
          closefn:setOpenDialog,
          callback:null
        })
        setOpenDialog(true)
        setLoading(false);
        return;
      }
      const cid = transaction.slice(7);
      const response = await axios.get(
        `http://localhost:3000/api/v1/company/signin/${cid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const dataa = handleDecrypt(response.data.data.data);
      if(!(dataa?.user)) {
        setDialogProps({
          msg:"Wrong Private Key",
          closefn:setOpenDialog,
          callback:null
        })
        setOpenDialog(true)
        setLoading(false);
        return;
      }
      setAccData({ ...dataa, tokenId: formData.tokenId, key: key });
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      alert(`some Error Occured\n${error}`);
    }
  }

  return (
    <>
    {
      loading &&
      <div className="w-[100vw] h-[100vh] glassmorphism fixed flex justify-center items-center">
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
      <div className="flex w-[100vw]">
        <div className="col1">
          <img src={logo} alt="" />
        </div>

        <div className="col2">
          <h1 style={{fontSize:'2rem',margin:'20px 0px'}} className="login">Login to your Account</h1>

          <form className="create" onSubmit={(e)=>{
            e.preventDefault();
            if(!isConnected) {
              setOpenDialog(true);
              setDialogProps({
                msg: `Connect to your Wallet!`,
                closefn: setOpenDialog,
                callback: null,
              });
              return
            }
            handleSubmit();
          }}>
            <label>Enter your Token Id</label>
            <input style={{margin:'10px 0px'}}
              type="text"
              name="tokenId"
              onChange={handleChange}
              required
            />
            {/* <label>Enter your Wallet Address</label>

            <input style={{margin:'10px 0px'}} type="text" name="user" onChange={handleChange} required /> */}
            <label>Enter your Password</label>
            <input style={{margin:'10px 0px'}}
              type="text"
              name="key"
              onChange={(e) => {
                setKey(e.target.value);
              }}
              required
            />

            <button className="submit" type="submit">Proceed</button>
          </form>
          <p className="register" type="submit">
            Not A User?{" "}
            <a
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
