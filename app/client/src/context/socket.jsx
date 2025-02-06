import { createContext, useState } from "react";

export const SocketContext = createContext();
export const SockerContextProvider = ({children})=>{
    const [socketId , setSocketId] = useState(null);
    return(
        <SocketContext.Provider value={{socketId , setSocketId}}>
            {children}
        </SocketContext.Provider>
    )
}