// En: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- ESTILOS ---
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'; 
import './styles/productos.css';
import './styles/detalle-producto.css';
import './styles/nosotros.css';
import './styles/contacto.css';
import './styles/blog.css';
import './styles/login.css'; 
import './styles/carrito.css';
// (Si tienes CSS para admin, impórtalo también)
// import './styles/homeAdmin.css'; 
import './index.css';

// --- CONTEXTO ---
import { CartProvider } from './hooks/useCart.jsx'; // Corregido: Asume que está en hooks
import { AuthProvider } from './context/AuthProvider.jsx'; 

// --- LAYOUT Y COMPONENTES ---
import App from './App.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';

// --- PÁGINAS ---
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx'; 
import Blog from './pages/Blog.jsx';
import DetalleBlog from './pages/DetalleBlog.jsx'; // Asegúrate que este archivo exista
import Login from './pages/Login.jsx'; 
import Perfil from './pages/Perfil.jsx'; 
import Carrito from './pages/Carrito.jsx'; 
import AdminLogin from './pages/AdminLogin.jsx'; // <-- IMPORTACIÓN CLAVE
import HomeAdmin from './pages/HomeAdmin.jsx'; // Asume que existe
import CrearProducto from './pages/CrearProducto.jsx'; // Asume que existe
import VerProductosAdmin from './pages/VerProductosAdmin.jsx'; // Asume que existe
import GestionDestacados from './pages/GestionDestacados.jsx'; // Asume que existe

// --- CONFIGURACIÓN DEL ROUTER ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      // --- Rutas Públicas ---
      { path: '/', element: <Home /> },
      { path: '/productos', element: <Productos /> },
      { path: '/producto/:codigo', element: <DetalleProducto /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/contacto', element: <Contacto /> }, 
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <DetalleBlog /> }, 
      { path: '/login', element: <Login /> }, // Login de usuario normal
      { path: '/carrito', element: <Carrito /> },
      
      // --- Ruta Pública para Admin Login ---
      { 
        path: '/admin-login',  // <-- RUTA CLAVE
        element: <AdminLogin /> 
      },

      // --- Rutas de Cliente Protegidas ---
      { 
        path: '/perfil', 
        element: ( <RutaProtegida> <Perfil /> </RutaProtegida> ) 
      },
      
      // --- Rutas de Admin Protegidas ---
      { 
        path: '/admin/home', 
        element: ( <RutaProtegida requireAdmin={true}> <HomeAdmin /> </RutaProtegida> ) 
      },
      { 
        path: '/admin/crear-producto', 
        element: ( <RutaProtegida requireAdmin={true}> <CrearProducto /> </RutaProtegida> ) 
      },
      { 
        path: '/admin/ver-productos', 
        element: ( <RutaProtegida requireAdmin={true}> <VerProductosAdmin /> </RutaProtegida> ) 
      },
      { 
        path: '/admin/gestionar-destacados', 
        element: ( <RutaProtegida requireAdmin={true}> <GestionDestacados /> </RutaProtegida> ) 
      },

      // (Placeholder para checkout)
      { path: '/checkout', element: <div><h1>Página Checkout (en construcción)</h1></div> },
    ],
  },
  // Puedes añadir rutas fuera del layout App aquí si es necesario
]);

// --- RENDERIZADO ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);