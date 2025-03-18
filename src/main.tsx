import './public-path';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
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

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('[App2] Running in standalone mode');
  render({});
} else {
  console.log('[App2] Running inside Qiankun');
  renderWithQiankun({
    mount: mount,
    bootstrap: bootstrap,
    unmount: unmount,
    update: update,
  });
}

export async function bootstrap() {
  console.log('[App2] bootstrapped');
}

export async function mount(props: any) {
  console.log('[App2] mounted', props);
  render(props);
}

export async function unmount(props: any) {
  console.log('[App2] unmount', props);
  if (root) {
    root.unmount();
    root = null;
  }
}

export async function update(props: any) {
  console.log('[App2] update', props);
}
