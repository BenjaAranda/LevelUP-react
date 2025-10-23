// En: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './index.css';

// 1. IMPORTAR EL PROVEEDOR DEL CARRITO
import { CartProvider } from './hooks/useCart.jsx';

// Layout y Páginas
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx'; // <-- Página nueva
import DetalleProducto from './pages/DetalleProducto.jsx'; // <-- Página nueva

// Configuración del Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/productos', // <-- Ruta nueva
        element: <Productos />,
      },
      {
        path: '/producto/:codigo', // <-- Ruta nueva para detalles (dinámica)
        element: <DetalleProducto />,
      }
      // Aquí puedes agregar más rutas (Nosotros, Contacto, etc.)
    ],
  },
]);

// 2. ENVOLVER LA APP CON EL CARTPROVIDER
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);