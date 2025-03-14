// Extend the global `Window` interface to include qiankun-specific properties
declare global {
    interface Window {
      __POWERED_BY_QIANKUN__?: boolean; // Optional since it might not always be defined
      __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string; // Optional for standalone mode
    }
  }
  
  // Declare the Webpack `__webpack_public_path__` variable
  declare let __webpack_public_path__: string;
  
  // Dynamically set the Webpack public path when running inside qiankun
  if (window.__POWERED_BY_QIANKUN__) {
    // Ensure the injected path is defined before assigning it
    if (window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
      console.log('[Public Path] Injected Public Path: ', window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__);
    } else {
      console.warn(
        '[Public Path] __INJECTED_PUBLIC_PATH_BY_QIANKUN__ is not defined!'
      );
    }
  } else {
    // For standalone mode, use the base URL from the import.meta.env
    console.log('[Public Path] Running in standalone mode, using default public path');
    // No need to set __webpack_public_path__ in Vite as it handles this automatically
  }
  