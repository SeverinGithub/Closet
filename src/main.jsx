import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClosetProvider } from './store.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClosetProvider>
      <App />
    </ClosetProvider>
  </React.StrictMode>,
);
