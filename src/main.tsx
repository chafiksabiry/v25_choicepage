import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Add this import
import App from './App';
import './index.css';
import './public-path';

// Function to render the React app
function render(props: { container?: HTMLElement }) {
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root') // Use the container provided by qiankun
    : document.getElementById('root'); // Fallback for standalone mode

  if (rootElement) {
    console.log('[App] Rendering in container:', rootElement);  // Debug line
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>  {/* Add BrowserRouter here */}
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  } else {
    console.warn('[App] Root element not found!');  // Debug line
  }
}

// Standalone mode (if running outside qiankun)
if (!window.__POWERED_BY_QIANKUN__) {
  console.log('[App] Running in standalone mode');
  render({});
}

// Qiankun lifecycle methods
export async function bootstrap() {
  console.log('[App] Bootstrapping...');
}

export async function mount(props: any) {
  console.log('[App] Mounting...', props);
  const { container } = props;
  
  if (container) {
    console.log('[App] Found container for mounting:', container);  // Debug line
  } else {
    console.warn('[App] No container found for mounting');  // Debug line
  }

  render(props);
}

export async function unmount(props: any) {
  console.log('[App] Unmounting...', props);
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement) {
    console.log('[App] Unmounting from container:', rootElement);  // Debug line
    createRoot(rootElement).unmount();
  } else {
    console.warn('[App] Root element not found for unmounting!');  // Debug line
  }
}
