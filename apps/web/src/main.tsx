import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './mocks';

const ROOT_ELEMENT_ID = 'root';
const MSW_READY_EVENT = 'mswready';
const MSW_LOAD_TIMEOUT = 1000;

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  throw new Error(`Root element with id '${ROOT_ELEMENT_ID}' not found`);
}

const root = createRoot(rootElement);

const renderApp = () => (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.env.PROD) {
  root.render(renderApp());
} else {
  // In development, wait for MSW to be ready
  const handleMswReady = () => {
    window.removeEventListener(MSW_READY_EVENT, handleMswReady);
    root.render(renderApp());
  };

  window.addEventListener(MSW_READY_EVENT, handleMswReady);

  // Fallback in case MSW doesn't initialize
  setTimeout(() => {
    if (!document.querySelector(`#${ROOT_ELEMENT_ID} > *`)) {
      console.warn('[MSW] Fallback rendering - MSW may not be working');
      root.render(renderApp());
      window.removeEventListener(MSW_READY_EVENT, handleMswReady);
    }
  }, MSW_LOAD_TIMEOUT);
}
