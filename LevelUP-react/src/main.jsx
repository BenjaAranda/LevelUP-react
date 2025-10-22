// En: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider'; 
import { CartProvider } from './context/CartProvider'; // <--- 1. IMPORTA EL CART PROVIDER

import './styles/main.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx'; 
import Productos from './pages/Productos.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import Carrito from './pages/Carrito.jsx';
import Perfil from './pages/Perfil.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx'; // <--- 2. IMPORTA LA NUEVA PÁGINA

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [ 
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/productos', element: <Productos /> }, // <-- Página de lista
      { 
        path: '/producto/:codigo', // <--- 3. AÑADE LA RUTA DINÁMICA
        element: <DetalleProducto /> 
      },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/contacto', element: <Contacto /> },
      { path: '/carrito', element: <Carrito /> },
      { path: '/perfil', element: <Perfil /> },
      { path: '/admin-login', element: <AdminLogin /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* <--- 4. ENVUELVE LA APP CON EL CART PROVIDER */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);