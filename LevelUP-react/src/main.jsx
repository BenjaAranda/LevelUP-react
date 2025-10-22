// En: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/main.css';

import App from './App.jsx';
import Home from './pages/Home.jsx'; // ¡Importante!

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [ // ¡Añadimos la propiedad children!
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);