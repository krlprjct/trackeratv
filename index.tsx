import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/* Плавная прокрутка для всех якорей */
html {
  scroll-behavior: smooth;
}

/* Отступ сверху при переходе по якорю (чтобы не закрывал navbar) */
section[id] {
  scroll-margin-top: 80px;
}