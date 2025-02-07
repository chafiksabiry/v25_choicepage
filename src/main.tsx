import './public-path';  // For proper Qiankun integration
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';  // Use HashRouter for micro-frontends
import App from './App';
import './index.css';

if (!window.System) {
  throw new Error('SystemJS is not loaded!');
}

// Store the root instance for proper unmounting
let root: ReturnType<typeof createRoot> | null = null;

function render(props: { container?: HTMLElement }) {
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement) {
    console.log('[App2] Rendering in container:', rootElement);
    // Create the root instance if it doesn't exist
    if (!root) {
      root = createRoot(rootElement);
    }
    root.render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    );
  } else {
    console.warn('[App2] Root element not found!');
  }
}

// Standalone mode: If the app is running outside Qiankun, it will use this code
if (window.__POWERED_BY_QIANKUN__) {
  console.log('[App] Running inside Qiankun');
  // Qiankun will control the lifecycle
} else {
  console.log('[App] Running in standalone mode');
  render({});
}

// Qiankun lifecycle methods

export async function bootstrap() {
  console.time('[App2] bootstrap');
  console.log('[App2] Bootstrapping...');
  // Return a resolved promise (or perform async initialization if needed)
  return Promise.resolve();
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
