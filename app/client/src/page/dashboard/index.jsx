import React, { useContext, useEffect, useState , useRef  } from "react";
import { useNavigate } from "react-router";
import { Context } from "../../context/context.jsx";
import PieChart from "../../components/pieChart.jsx";
import LineChart from "../../components/lineChart.jsx";
import Navbar from "../../components/navbar.jsx";
import { SocketContext } from "../../context/socket.jsx"
import { backendUrl } from "../../configs/constants.js";
import io from 'socket.io-client';
import { GetCredits } from "../../apis/iot.contracts.js";
import Loader from "../../components/loader.jsx";

function Dashboard() {

    const context = useContext(Context);
    const {accData , socketId , setAccData , isConnected  , setIotData , iotData} = context;
    const socketContext = useContext(SocketContext);
    const { setSocketId} = socketContext;
    const iots = accData.iots;
    const [activities , setActivities] = useState([]);
    const  [loading , setLoading ] = useState(false);
    const [error , setError] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
      if(!accData.key || !accData.businessName) {
        navigate('/sign-in')
      }
    },[])

    const getCreditsTillYesterday = async()=>{
      try {
        let temp={};
        setLoading(true);
        await Promise.all(
          iots.map(async (iot) => {
           temp[iot] = await GetCredits({ iot, address: accData.user })
          })
        );
        setLoading(false);
        setError(false);
        // setIotData(temp);
      } catch (error) {
        setLoading(false);
        setError('Some Error Fecthing the previous Consumptions')
      }
    }
    
    useEffect(() => {
      getCreditsTillYesterday();
    }, []); 

    const socketRef = useRef(null);
    const iotDataRef = useRef(iotData);
  
    useEffect(() => {
      if (!socketRef.current) {
        const newSocket = io(backendUrl);
        socketRef.current = newSocket;
  
        newSocket.on("connect", () => {
          newSocket.emit("subscribe", accData.iots);
        });
  
        newSocket.on("activities", (activities) => {
          if (!activities) return;
          setActivities(JSON.parse(activities));
        });
  
        newSocket.on("trade", (msg) => {
          setActivities((prevActivities) => [...prevActivities, msg]);
        });
  
        newSocket.on("data", (data) => {
          console.log(data.carbonCredits) 
          setIotData((prevIotData) => [...prevIotData, data.carbonCredits]);

          // setIotData((prevIotData)=>[...prevIotData,data.cabronCredits]);
          // setIotData((prevIotData) => {
          //   let tempData = new Map(prevIotData);
          //   let history = [...tempData.get(data.identifier)];
          //   history[history.length - 1] = data.carbonCredits;
          //   tempData.set(data.identifier, history);
      
          //   let consumption = 0;
          //   tempData.forEach((value) => {
          //     consumption += value[value.length - 1];
          //   });
      
            // setAccData((prevAccData) => ({
            //   ...prevAccData,
            //   carbonCredits: prevAccData.limit - prevAccData.activity - consumption,
            // }));
      
          //   return tempData;
          // });
        });
  
        newSocket.on("disconnect", () => {
          socketRef.current = null;
        });
      }
  
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, [isConnected]); // Removed iotData from dependencies

  return (
    <>
    <Navbar/>
    {
      accData.key && 
      <div className="relative to-black text-white w-[100vw] h-[100vh] pt-[80px]">
      {/* <div class="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#eaeaea] to-[#d6d6d6] opacity-80 blur-xl"></div> */}
      <div className="w-full h-full relative z-10  bg-[#191919] bg-opacity-0  shadow-lg ">

        <div className="w-[95%] mx-auto fit mt-4 flex gap-4 justify-between">
          <div className="flex flex-col w-full">
            <div className="w-full h-[55vh] my-2">
             {
              loading?
              <div className="w-[70vw] h-full flex justify-center items-center">
                  <Loader />
                </div>
                :(
                  error?
                  <div className="w-[70vw] h-full flex justify-center items-center flex flex-col text-2xl font-semibold
                  bg-[#191919] h-[55vh] text-white p-4 rounded-lg shadow-lg">
                  {error}
                </div>:
                <LineChart/>
                )
             }
            </div>

            <div className="w-full mt-2 bg-[#191919] h-[25vh] px-4 py-4 rounded-[10px] overflow-x-auto">
              <p className="text-xl sticky top-0 bg-[#191919">Today's Activities:</p>
              <div className="w-full mt-4" style={{height:'max-content'}}>
                {activities &&
                  activities.length > 0 ? 
                  (
                   <>
                   { activities.map((activity, index) =>
                      <div key={index} className="bg-[#202020] flex mb-2 items-center justify-between p-2 rounded-md my-2">
                        <p className="text-sm font-medium">{activity}</p>
                      </div>
                    )}
                   </>
                  ):(
                    <div className="text-center">No Recent Activities</div>
                  )
                }
              </div>
            </div>
          </div>

          <div className="w-4/12 my-2">
            <PieChart />
          </div>

        </div>
      </div>
    </div>
    }
    </>
  );
}

export default Dashboard;
