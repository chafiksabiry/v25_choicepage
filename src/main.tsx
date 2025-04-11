import React from 'react';
import './public-path';  // For proper Qiankun integration
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

console.log('[App2] main.tsx is being executed');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';  // Use HashRouter for micro-frontends
import App from './App';
import './index.css';
import Cookies from 'js-cookie';


const userId = Cookies.get('userId');
console.log('Stored userId from cookie:', userId);
// Store the root instance for proper unmounting

if (userId == null){
  window.location.href = '/app1'
}
let root: ReturnType<typeof createRoot> | null = null;

function render(props: { container?: HTMLElement }) {
  const { container } = props;
  console.log('[App2] Render function called with props:', props);
  console.log('[App2] Container provided:', container);
  
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement) {
    console.log('[App2] Rendering in container:', rootElement);
    // Create the root instance if it doesn't exist
    if (!root) {
      console.log('[App2] Creating new root instance');
      root = createRoot(rootElement);
    }
    console.log('[App2] Rendering App component');
    root.render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    );
    console.log('[App2] App component rendered');
  } else {
    console.warn('[App2] Root element not found!');
    console.log('[App2] Document body:', document.body.innerHTML);
  }
}

export async function bootstrap() {
  console.time('[App2] bootstrap');
  console.log('[App2] Bootstrapping...');
  
  try {
    // Immediate resolution to avoid timeouts
    console.log('[App2] Bootstrap completed successfully');
    console.timeEnd('[App2] bootstrap');
  } catch (error) {
    console.error('[App2] Bootstrap failed:', error);
    console.timeEnd('[App2] bootstrap');
    throw error;
  }
}

export async function mount(props: any) {
  console.log('[App2] Mounting...', props);
  const { container } = props;
  if (container) {
    console.log('[App2] Found container for mounting:', container);
  } else {
    console.warn('[App2] No container found for mounting');
  }
  render(props);
  return Promise.resolve();
}

export async function unmount(props: any) {
  console.log('[App2] Unmounting...', props);
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement && root) {
    console.log('[App2] Unmounting from container:', rootElement);
    root.unmount();
    root = null;  // Reset the root instance
  } else {
    console.warn('[App2] Root element not found for unmounting!');
  }
  return Promise.resolve();
}

// Add error handling for module loading
window.addEventListener('error', (event) => {
  console.error('[App2] Error loading module:', event);
});

// Standalone mode: If the app is running outside Qiankun, it will use this code
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('[App2] Running in standalone mode');
  console.log('[App2] Document ready state:', document.readyState);
  
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[App] DOM content loaded, rendering app');
      render({});
    });
  } else {
    console.log('[App] DOM already loaded, rendering app immediately');
    try {
      render({});
    } catch (error) {
      console.error('[App] Error rendering app:', error);
    }
  }
} else {
  console.log('[App] Running inside Qiankun');
  // Qiankun will control the lifecycle
  render({});
}
