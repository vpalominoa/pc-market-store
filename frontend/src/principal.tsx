import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './estilos/global.css';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
  throw new Error('No se encontró el elemento raíz');
}

ReactDOM.createRoot(elementoRaiz).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);