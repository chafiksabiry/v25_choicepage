import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import './public-path';

console.log('[App2] main.tsx is being executed');

// Store the root instance for unmounting
let root: ReturnType<typeof createRoot> | null = null;

// Rendering function
function render(props: { container?: HTMLElement }) {
  const { container } = props;
  console.log('[App2] Rendering with container:', container);

  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (!rootElement) {
    console.error('[App2] Root element not found!');
    return;
  }

  if (!root) {
    console.log('[App2] Creating new root instance');
    root = createRoot(rootElement);
  }

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Lifecycle methods for Qiankun
export async function bootstrap() {
  console.log('[App2] Bootstrap called');
}

export async function mount(props: any) {
  console.log('[App2] Mount called', props);
  render(props);
}

export async function unmount(props: any) {
  console.log('[App2] Unmount called', props);

  if (root) {
    root.unmount();
    root = null;
  }
}
export async function update(props: any){
  console.log('[App2] Update called', props);
}
// Handle standalone mode (if NOT inside Qiankun)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('[App2] Running in standalone mode');
  render({});
} else {
  console.log('[App2] Running inside Qiankun');
  renderWithQiankun({ bootstrap, mount, unmount, update });
}
