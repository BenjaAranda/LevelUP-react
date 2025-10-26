// En: src/main.jsx (Versión Completa y Verificada)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- ESTILOS ---
// Importamos todos los CSS necesarios. Asegúrate de que estos archivos existan en src/styles/
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/productos.css';
import './styles/detalle-producto.css';
import './styles/nosotros.css';
import './styles/contacto.css';
import './styles/blog.css';
import './styles/login.css';
import './styles/carrito.css';
import './styles/admin-login.css'; // Asegúrate que este exista
import './styles/homeAdmin.css'; // CSS que proporcionaste
import './styles/crearProducto.css';
import './styles/gestionDestacados.css'; // Usado también por GestionCategorias
import './styles/verProductosAdmin.css';
import './index.css'; // Estilos base de Vite

// --- CONTEXTO ---
// Importamos los Providers para el Carrito y la Autenticación
// Asegúrate que las rutas sean correctas (ej: si CartProvider está en hooks o context)
import { CartProvider } from './hooks/useCart.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';

// --- LAYOUT Y COMPONENTES ---
// Importamos el Layout principal y el componente para proteger rutas
import App from './App.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';

// --- PÁGINAS ---
// Importamos TODOS los componentes de página que tu aplicación usará
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import Blog from './pages/Blog.jsx';
import DetalleBlog from './pages/DetalleBlog.jsx';
import Login from './pages/Login.jsx';
import Perfil from './pages/Perfil.jsx';
import Carrito from './pages/Carrito.jsx';
// --- PÁGINAS ADMIN ---
import AdminLogin from './pages/AdminLogin.jsx';
import HomeAdmin from './pages/HomeAdmin.jsx';
import CrearProducto from './pages/CrearProducto.jsx';
import VerProductosAdmin from './pages/VerProductosAdmin.jsx';
import GestionDestacados from './pages/GestionDestacados.jsx';
import EditarProducto from './pages/EditarProducto.jsx';
import ProductosCriticos from './pages/ProductosCriticos.jsx';
import GestionCategorias from './pages/GestionCategorias.jsx'; // <-- Importación para GestionCategorias

// --- CONFIGURACIÓN DEL ROUTER ---
// Definimos todas las rutas de la aplicación
const router = createBrowserRouter([
  {
    path: '/', // Todas las rutas definidas aquí usarán el Layout <App />
    element: <App />,
    children: [ // Estas son las páginas que se renderizarán dentro del <Outlet /> de App.jsx
      // --- Rutas Públicas ---
      { path: '/', element: <Home /> }, // Página principal
      { path: '/productos', element: <Productos /> }, // Página de listado de productos
      { path: '/producto/:codigo', element: <DetalleProducto /> }, // Página de detalle (ruta dinámica)
      { path: '/nosotros', element: <Nosotros /> }, // Página "Sobre Nosotros"
      { path: '/contacto', element: <Contacto /> }, // Página de Contacto
      { path: '/blog', element: <Blog /> }, // Página principal del Blog
      { path: '/blog/:slug', element: <DetalleBlog /> }, // Página de detalle del Blog (ruta dinámica)
      { path: '/login', element: <Login /> }, // Login/Registro de usuario normal
      { path: '/carrito', element: <Carrito /> }, // Página del carrito de compras

      // --- Ruta Pública para Admin Login ---
      // No está protegida para que el admin pueda iniciar sesión
      { path: '/admin-login', element: <AdminLogin /> },

      // --- Rutas de Cliente Protegidas ---
      // Solo accesibles si el usuario está logueado (verificado por RutaProtegida)
      {
        path: '/perfil',
        element: ( <RutaProtegida> <Perfil /> </RutaProtegida> )
      },

      // --- Rutas de Admin Protegidas ---
      // Solo accesibles si el usuario está logueado Y es admin (verificado por RutaProtegida con requireAdmin={true})
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
        path: '/admin/editar-producto/:codigo',
        element: ( <RutaProtegida requireAdmin={true}> <EditarProducto /> </RutaProtegida> )
      },
      {
        path: '/admin/gestionar-destacados',
        element: ( <RutaProtegida requireAdmin={true}> <GestionDestacados /> </RutaProtegida> )
      },
       {
        path: '/admin/productos-criticos',
        element: ( <RutaProtegida requireAdmin={true}> <ProductosCriticos /> </RutaProtegida> )
      },
      { // <-- Ruta para Gestionar Categorías
        path: '/admin/gestionar-categorias',
        element: ( <RutaProtegida requireAdmin={true}> <GestionCategorias /> </RutaProtegida> )
      },


      // (Placeholder para la página de checkout - futura implementación)
      { path: '/checkout', element: <div><h1>Página Checkout (en construcción)</h1></div> },
    ],
  },
  // Aquí podrías añadir rutas que NO usen el Layout <App /> si fuera necesario
]);

// --- RENDERIZADO DE LA APLICACIÓN ---
// Obtenemos el div #root del HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvemos TODA la aplicación con los Providers de Contexto */}
    {/* AuthProvider debe ir por fuera si CartProvider depende del usuario logueado */}
    <AuthProvider>
      <CartProvider>
        {/* RouterProvider es el que realmente monta la aplicación según la URL */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);