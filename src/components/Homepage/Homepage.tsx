import React from 'react';
import { useWallet } from '@/context/WalletContext';
import MapComponent from '../Map/Map';

const HomePage: React.FC = () => {
    const {address} = useWallet();

    return (
        <>
        {/* <div className="home">
            <Button size="lg">Mark your plot</Button>
        </div> */}
        <MapComponent/>
        {console.log(address)}
        </>
        
  );
};

export default HomePage;

