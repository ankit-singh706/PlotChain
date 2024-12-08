// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface WalletContextType {
//   address: string | null;
//   connectWallet: () => void;
//   disconnectWallet: () => void;
// }

// interface WalletProviderProps {
//   children: ReactNode; // Typing children as ReactNode
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined);

// export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
//   const [address, setAddress] = useState<string | null>(null);

//   useEffect(() => {
//     const checkConnection = async () => {
//       if (window.ethereum) {
//         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//         if (accounts.length > 0) {
//           setAddress(accounts[0]);
//         }
//       }
//     };
//     checkConnection();
//   }, []);


//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });
//         setAddress(accounts[0]);
//       } catch (error) {
//         console.error('User rejected the request');
//       }
//     } else {
//       alert('MetaMask is not installed!');
//     }
//   };


//   const disconnectWallet = () => {
//     setAddress(null);
//   };

//   return (
//     <WalletContext.Provider value={{ address, connectWallet, disconnectWallet }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// // Custom hook to use the wallet context
// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error('useWallet must be used within a WalletProvider');
//   }
//   return context;
// };
