import { useState, useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./page/register/index.jsx";
import { useContext } from "react";
import { Context } from "./context/context";
import SignIn from "./page/signin/index.jsx";
import Dashboard from "./page/dashboard/index.jsx";
import P2P from "./page/p2p/index.jsx";
import KYC from "./page/kyc/index.jsx";
import styles from "./styles/Home.module.css";
import Landing from "./page/landing/index.jsx"

import { useAccount } from "wagmi";

function App() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const context = useContext(Context);
  const { setAccData, setIsConnected } = context;
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setAccData({user:address});
      setIsConnected(isConnected);
    }else {
      setAccData({user:null});
      setIsConnected(false);
    }
  }, [isConnected, address]);

  return (
    <>
      <div className="wallets">
        <header>
          <div
            className={styles.backdrop}
            style={{
              opacity:
                isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
            }}
          />
          <div className={styles.header}>
            <div className={styles.buttons}>
              <div
                onClick={closeAll}
                className={`${styles.highlight} ${
                  isNetworkSwitchHighlighted ? styles.highlightSelected : ``
                }`}
              >
                <w3m-network-button />
              </div>
              <div
                onClick={closeAll}
                className={`${styles.highlight} ${
                  isConnectHighlighted ? styles.highlightSelected : ``
                }`}
              >
                <w3m-button />
              </div>
            </div>
          </div>
        </header>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/p2p" element={<P2P />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
