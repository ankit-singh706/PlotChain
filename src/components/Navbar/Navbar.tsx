import { client } from '@/App';
import Logo from '../../assets/plotchain_logo.png';
// import WalletButton from '../WalletButton/WalletButton';
// import SmartContract from '@/utils/smartContract';
import { ConnectButton } from 'thirdweb/react';

type NavbarProps = {
  title: string; // Prop is a string
};

import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [createWallet("io.metamask")];

const Navbar = ({ }: NavbarProps) => {
  const account = useActiveAccount();
  return (
    <>
      <nav>
        <div className="logo_container">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="button">
          {/* <WalletButton/> */}
          <ConnectButton client={client}
            wallets={wallets}
            connectModal={{ size: "compact" }}
          />
          {/* <p>Wallet address: {JSON.stringify(account)}</p> */}

          {/* <SmartContract/> */}
        </div>
      </nav>
      <hr></hr>
    </>
  );
};

export default Navbar;