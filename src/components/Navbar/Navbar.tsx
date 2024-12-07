import React from 'react';
import Logo from '../../assets/plotchain_logo.png';
import { Button } from "@/components/ui/button"
import WalletButton from '../WalletButton/WalletButton';


type NavbarProps = {
  title: string; // Prop is a string
};

const Navbar = ({ }: NavbarProps) => {
  return (
    <>
    <nav>
      <div className="logo_container">
         <img src={Logo} alt="Logo" />
      </div>
      <div className="button">
         <WalletButton/>
      </div>
    </nav>
    <hr></hr>
    </>
  );
};

export default Navbar;