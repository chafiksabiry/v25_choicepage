declare global {
    interface Window {
      System: any;
    }
  }
  
  // Make sure the file is recognized as a module by including this at the end
  export {};
  