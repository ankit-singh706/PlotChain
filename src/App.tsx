import Navbar from './components/Navbar/Navbar'
import HomePage from './components/Homepage/Homepage'
import './App.css'
import { createThirdwebClient, getContract} from "thirdweb";
import { defineChain } from "thirdweb/chains";
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

  return (
    <>
      <Navbar title='Nav' />
      <div className="home_container">
        <HomePage />
      </div>
    </>
  )
}

export default App
