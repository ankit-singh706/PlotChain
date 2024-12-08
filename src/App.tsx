import Navbar from './components/Navbar/Navbar'
import HomePage from './components/Homepage/Homepage'
import './App.css'
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider, TransactionButton, useSendTransaction } from "thirdweb/react";
// import { useWallet } from './context/WalletContext';
import { useState } from 'react';
import MintLandABI from './utils/mintLand';

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
  clientId: "cd71db82c3d6bdfb840ddb6fe7adf689",
});

// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0xb2a671c4FE3D9269C84644Eb789B63958f917EC3",
  abi: MintLandABI as any,
});


function App() {

  const [area, setArea] = useState(100);
  const [coordinates, setCoordinates] = useState("10.123, 20.456");
  const [zoning, setZoning] = useState("Residential");
  const [valuation, setValuation] = useState(1000000);
  const [additionalInfo, setAdditionalInfo] = useState("Some additional information");

  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function mintLand(address to, string memory tokenURI, uint256 area, string memory coordinates, string memory zoning, uint256 valuation, string memory additionalInfo)",
      params: ["0x02005126FfcB4e008cf83B07609825F46e757789", "otkenuri", BigInt(area), coordinates, zoning, BigInt(valuation), additionalInfo],
    });
    console.log("Transaction Callled");
    sendTransaction(transaction);
  };

  return (
    <>
      <TransactionButton
        transaction={() => {
          const tx = prepareContractCall({
            contract,
            method: "function mintLand(address to, string memory tokenURI, uint256 area, string memory coordinates, string memory zoning, uint256 valuation, string memory additionalInfo)",
            params: ["0x02005126FfcB4e008cf83B07609825F46e757789", "otkenuri", BigInt(area), coordinates, zoning, BigInt(valuation), additionalInfo],
          });
          console.log(tx)
          return tx;
        }}
        onTransactionSent={(result) => {
          console.log("Transaction submitted", result.transactionHash);
        }}
        onTransactionConfirmed={(receipt) => {
          console.log("Transaction confirmed", receipt.transactionHash);
        }}
        onError={(error) => {
          console.error("Transaction error", error);
        }}
      >
        Send
      </TransactionButton>
      <button onClick={onClick}>kkk</button>
      <Navbar title='Nav' />
      <div className="home_container">
        <HomePage />
      </div>
    </>
  )
}

export default App
