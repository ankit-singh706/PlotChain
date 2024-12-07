import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '../ui/button';
import MapComponent from '../Map/Map';

const HomePage: React.FC = () => {
    const {address} = useWallet();

    return (
        <>
        {/* <div className="home">
            <Button size="lg">Mark your plot</Button>
        </div> */}
        <MapComponent/>
        </>
        
  );
};

export default HomePage;

