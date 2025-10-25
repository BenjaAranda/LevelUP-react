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
import './styles/homeAdmin.css';
import './styles/crearProducto.css';
import './styles/verProductosAdmin.css';
import './styles/gestionDestacados.css'; // (Añadido por si acaso)
import './index.css';

// --- CONTEXTO ---
import { CartProvider } from './context/CartProvider.jsx'; 
import { AuthProvider } from './context/AuthProvider.jsx'; 

// --- LAYOUT Y COMPONENTES ---
import App from './App.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';

// --- PÁGINAS (ESTO ES LO QUE TE FALTA) ---
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx'; 
import Blog from './pages/Blog.jsx';
import Login from './pages/Login.jsx'; 
import Perfil from './pages/Perfil.jsx'; 
import Carrito from './pages/Carrito.jsx'; 
import AdminLogin from './pages/AdminLogin.jsx';
import HomeAdmin from './pages/HomeAdmin.jsx';
import CrearProducto from './pages/CrearProducto.jsx';
import VerProductosAdmin from './pages/VerProductosAdmin.jsx';
import GestionDestacados from './pages/GestionDestacados.jsx';


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
      { path: '/login', element: <Login /> },
      { path: '/carrito', element: <Carrito /> },
      
      // --- Rutas de Cliente Protegidas ---
      { 
        path: '/perfil', 
        element: (
          <RutaProtegida>
            <Perfil />
          </RutaProtegida>
        ) 
      },
      
      // --- Rutas de Admin Protegidas ---
      { 
        path: '/admin-login', 
        element: <AdminLogin /> // <-- Esta es tu línea 36 (aprox)
      },
      { 
        path: '/admin/home', 
        element: (
          <RutaProtegida requireAdmin={true}>
            <HomeAdmin />
          </RutaProtegida>
        ) 
      },
      { 
        path: '/admin/crear-producto', 
        element: (
          <RutaProtegida requireAdmin={true}>
            <CrearProducto />
          </RutaProtegida>
        ) 
      },
      { 
        path: '/admin/ver-productos', 
        element: (
          <RutaProtegida requireAdmin={true}>
            <VerProductosAdmin />
          </RutaProtegida>
        ) 
      },
      { 
        path: '/admin/gestionar-destacados', 
        element: (
          <RutaProtegida requireAdmin={true}>
            <GestionDestacados />
          </RutaProtegida>
        ) 
      }
    ],
  },
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