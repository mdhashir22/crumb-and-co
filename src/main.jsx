
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import App from './App.jsx';
import './styles/main.scss';


ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
