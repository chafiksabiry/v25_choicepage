import './public-path';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

console.log('[App2] main.tsx is being executed');

let root: ReturnType<typeof createRoot> | null = null;

// Export lifecycle functions first
export async function bootstrap() {
  console.log('[App2] bootstrapped');
}

export async function mount(props: any) {
  console.log('[App2] mounted', props);
  const { container } = props;
  const rootElement = container 
    ? container.querySelector('#root')
    : document.querySelector('#root');

  if (!rootElement) {
    console.error('[App2] Root element not found');
    return;
  }

  root = createRoot(rootElement);
  root.render(
    <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app2' : '/'}>
      <App />
    </BrowserRouter>
  );
}

export async function unmount() {
  console.log('[App2] unmount');
  root?.unmount();
  root = null;
}

export async function update(props: any) {
  console.log('[App2] update', props);
}

// Initialize the application
const render = (props: any = {}) => {
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    const rootElement = document.querySelector('#root');
    if (!rootElement) {
      console.error('[App2] Root element not found in standalone mode');
      return;
    }
    root = createRoot(rootElement);
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
};

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('[App2] Running in standalone mode');
  render({});
} else {
  console.log('[App2] Running in qiankun mode');
  render({});
}
