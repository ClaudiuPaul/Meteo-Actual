// Librăria principală React
import React from 'react';
// Conectează React la browser
import ReactDOM from 'react-dom/client';
// Componenta principală a aplicației
import App from './App';
// Stilurile globale (culori, fonturi)
import './styles/index.css';

// Randează aplicația în elementul HTML cu id-ul "root"
ReactDOM.createRoot(document.getElementById('root')!).render(
  // Găsește posibile erori în cod
  <React.StrictMode>
    {/* Afișează aplicația */}
    <App />
  </React.StrictMode>
);
