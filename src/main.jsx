import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// Aquest fitxer només serveix per connectar React amb el <div id="root"> de l'index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);