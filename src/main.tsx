import React from 'react';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

let root: ReturnType<typeof createRoot> | null = null;

function render(props: { container?: HTMLElement }) {
  const { container } = props;
  const rootElement = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  if (rootElement) {
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
  }
}

// Register lifecycle hooks using `renderWithQiankun`
renderWithQiankun({
  bootstrap() {
    console.log('[App2] bootstrap');
  },
  mount(props) {
    console.log('[App2] mount', props);
    render(props);
  },
  unmount(props) {
    console.log('[App2] unmount', props);
    const { container } = props;
    const rootElement = container
      ? container.querySelector('#root')
      : document.getElementById('root');

    if (rootElement && root) {
      root.unmount();
      root = null;
    }
  }
});

// Standalone mode: If not running inside Qiankun, render immediately
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
