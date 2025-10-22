// En: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
// Importamos AuthProvider desde su nuevo archivo 'AuthProvider.jsx'
import { AuthProvider } from './context/AuthProvider'; 

// CSS Global
import './styles/main.css';

// Layout y Páginas
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx'; 
import Productos from './pages/Productos.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import Carrito from './pages/Carrito.jsx';
import Perfil from './pages/Perfil.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

// Configuración de todas las rutas de tu sitio
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El layout principal (con Navbar/Footer)
    children: [ 
      // Estas páginas se cargan dentro del <Outlet> de App.jsx
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/productos', element: <Productos /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/contacto', element: <Contacto /> },
      { path: '/carrito', element: <Carrito /> },
      { path: '/perfil', element: <Perfil /> },
      { path: '/admin-login', element: <AdminLogin /> },
    ],
  },
]);

// Renderizamos la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvemos TODA la aplicación con el AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);