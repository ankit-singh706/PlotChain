import React from 'react';
// import { Button } from '../ui/button';

const WalletButton: React.FC = () => {
  // const { address, connectWallet, disconnectWallet } = useWallet();

  // // Function to truncate the address
  // const truncateAddress = (address: string) => {
  //   if (address.length > 10) {
  //     return `${address.slice(0, 6)}...${address.slice(-4)}`;
  //   }
  //   return address;
  // };

  return (
    <div className='wallet_address'>
      {/* {address ? (
        <>
          <p>Connected Address: {truncateAddress(address)}</p>
          <Button onClick={disconnectWallet}>Disconnect</Button>
        </>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )} */}
    </div>
  );
};

export default WalletButton;

