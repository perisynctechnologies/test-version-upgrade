import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container);

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  serviceWorkerRegistration.register({
    onUpdate: registration => {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
      }, 30000);
    }
  });
}

// Render app only once
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preload critical assets
const preloadAssets = () => {
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.href = `${process.env.PUBLIC_URL}/static/js/main.chunk.js`;
  preloadLink.as = 'script';
  document.head.appendChild(preloadLink);
};
preloadAssets();

reportWebVitals();