import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { WalletProvider } from './context/WalletContext.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider >
      {/* <WalletProvider> */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      {/* </WalletProvider> */}
    </ThirdwebProvider>
  </StrictMode>,
)
