import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Pornește aplicația pe ecran
ReactDOM.createRoot(document.getElementById('root')!).render(
  // Găsește erori în cod
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
