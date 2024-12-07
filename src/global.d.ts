declare global {
    interface Window {
      ethereum?: any; // Declare `window.ethereum` to be any
      
    }
  }
  
  // Make sure this file is treated as a module
  export {};
  