import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './public-path';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

console.log('[App2] main.tsx is being executed');

// Store the root instance for unmounting
let root: ReturnType<typeof createRoot> | null = null;

// Rendering function
function render(props: any = {}) {
  const { container } = props;
  console.log('[App2] Rendering with container:', container);

  const rootElement = container
    ? container.querySelector('#root')
    : document.querySelector('#root');

  if (!rootElement) {
    console.error('[App2] Root element not found');
    return;
  }

  if (!root) {
    console.log('[App2] Creating new root instance');
    root = createRoot(rootElement);
  }

  root.render(
    <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app2' : '/'}>
      <App />
    </BrowserRouter>
  );
}

const lifecycle = {
  async bootstrap() {
    console.log('[App2] bootstrapped');
  },

  async mount(props: any) {
    console.log('[App2] mounted', props);
    render(props);
  },

  async unmount(props: any) {
    console.log('[App2] unmount', props);
    root?.unmount();
    root = null;
  },

  async update(props: any) {
    console.log('[App2] update', props);
  }
};

// Export lifecycle functions for qiankun
export const bootstrap = lifecycle.bootstrap;
export const mount = lifecycle.mount;
export const unmount = lifecycle.unmount;
export const update = lifecycle.update;

// Handle standalone mode (if NOT inside Qiankun)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('[App2] Running in standalone mode');
  render({});
} else {
  console.log('[App2] Running inside Qiankun');
  renderWithQiankun({
    mount: lifecycle.mount,
    bootstrap: lifecycle.bootstrap,
    unmount: lifecycle.unmount,
    update: lifecycle.update,
  });
}
