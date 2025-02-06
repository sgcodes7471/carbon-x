import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ContextProvider } from './context/context.jsx'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client';
import client from "./configs/apollo.js";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from "viem/chains";
import { SockerContextProvider } from './context/socket.jsx'

// 1. Get projectId
export const projectId = "556f704d7102922b2bfd2c6b88c70969";

// 2. Create wagmiConfig
export const metadata = {
  name: "web3-modal-setup",
  description: "Web3 Modal Example",
  icons:""
};

export const chains = [mainnet, arbitrum];
export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ApolloProvider client={client}>
    <WagmiConfig config={wagmiConfig}>
    <ContextProvider>
      <SockerContextProvider>
      <App />
      </SockerContextProvider>
    </ContextProvider>
    </WagmiConfig>
      </ApolloProvider>
  </StrictMode>,
)
