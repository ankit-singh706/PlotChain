import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider >
    <AnonAadhaarProvider _useTestAadhaar={true}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      </AnonAadhaarProvider>
    </ThirdwebProvider>
  </StrictMode>,
)
