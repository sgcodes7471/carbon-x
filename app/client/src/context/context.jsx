import { createContext, useState } from "react";

export const Context = createContext()
export const ContextProvider = ({children})=>{
    const [uri , setUri] = useState("");
    const [accData , setAccData] = useState({});
    const [isConnected , setIsConnected] = useState();
    const [iotData , setIotData] = useState([]); //use this to store the data of the iot in the daywise 
    
    return (
        <Context.Provider value={{uri , setUri , accData , setAccData ,
        isConnected , setIsConnected , iotData , setIotData}}>
            {children}
        </Context.Provider>
    )
}