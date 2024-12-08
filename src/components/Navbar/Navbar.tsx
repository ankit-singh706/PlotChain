import { client } from '@/App';
import Logo from '../../assets/plotchain_logo.png';
import { ConnectButton } from 'thirdweb/react';
import AnonAdhaarPlugin from '@/utils/AnonAadhar/AnonAadhaar';

type NavbarProps = {
  title: string; // Prop is a string
};

import { createWallet } from "thirdweb/wallets";

const wallets = [createWallet("io.metamask")];

console.log(wallets)

const Navbar = ({ }: NavbarProps) => {
  const wallets = [createWallet("io.metamask")];
  return (
    <>
      <nav>
        <div className="logo_container">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="auth_buttons">
          <div className="wallet_btn">
            <ConnectButton client={client}
              wallets={wallets}
              connectModal={{ size: "compact" }}
            />
          </div>
          <div className="anon_btn">
            <AnonAdhaarPlugin />
          </div>
        </div>
      </nav>
      <hr></hr>
    </>
  );
};

export default Navbar;