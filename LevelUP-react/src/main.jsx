
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
import './styles/admin-login.css'; 
import './styles/homeAdmin.css'; 
import './styles/crearProducto.css';
import './styles/gestionDestacados.css'; 
import './styles/verProductosAdmin.css'; 
import './styles/toast.css';
// CSS para el checkout (asegúrate que existan)
import './styles/checkout.css'; 
import './styles/pago-resultado.css'; 
import './index.css'; // Estilos base de Vite

// --- CONTEXTO ---
import { CartProvider } from './context/CartProvider.jsx';
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
import GestionCategorias from './pages/GestionCategorias.jsx';
import GestionUsuarios from './pages/GestionUsuarios.jsx';
import EditarUsuario from './pages/EditarUsuario.jsx';
import GestionOrdenes from './pages/GestionOrdenes.jsx';
// --- PÁGINAS CHECKOUT ---
import Checkout from './pages/Checkout.jsx';         
import PagoExitoso from './pages/PagoExitoso.jsx'; 
import PagoError from './pages/PagoError.jsx';     

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
      { path: '/login', element: <Login /> }, 
      { path: '/carrito', element: <Carrito /> }, 
      { path: '/admin-login', element: <AdminLogin /> }, 

      // --- Rutas de Cliente Protegidas ---
      {
        path: '/perfil',
        element: ( <RutaProtegida> <Perfil /> </RutaProtegida> )
      },

      // --- Rutas de Admin Protegidas ---
      { path: '/admin/home', element: ( <RutaProtegida requireAdmin={true}> <HomeAdmin /> </RutaProtegida> ) },
      { path: '/admin/crear-producto', element: ( <RutaProtegida requireAdmin={true}> <CrearProducto /> </RutaProtegida> ) },
      { path: '/admin/ver-productos', element: ( <RutaProtegida requireAdmin={true}> <VerProductosAdmin /> </RutaProtegida> ) },
      { path: '/admin/editar-producto/:codigo', element: ( <RutaProtegida requireAdmin={true}> <EditarProducto /> </RutaProtegida> ) },
      { path: '/admin/gestionar-destacados', element: ( <RutaProtegida requireAdmin={true}> <GestionDestacados /> </RutaProtegida> ) },
      { path: '/admin/productos-criticos', element: ( <RutaProtegida requireAdmin={true}> <ProductosCriticos /> </RutaProtegida> ) },
      { path: '/admin/gestionar-categorias', element: ( <RutaProtegida requireAdmin={true}> <GestionCategorias /> </RutaProtegida> ) },
      { path: '/admin/gestionar-usuarios', element: ( <RutaProtegida requireAdmin={true}> <GestionUsuarios /> </RutaProtegida> ) },
      { path: '/admin/editar-usuario/:email', element: ( <RutaProtegida requireAdmin={true}> <EditarUsuario /> </RutaProtegida> ) },
      { path: '/admin/gestionar-ordenes', element: ( <RutaProtegida requireAdmin={true}> <GestionOrdenes /> </RutaProtegida> ) },

      // --- RUTAS DE CHECKOUT (REEMPLAZANDO EL PLACEHOLDER) ---
      { 
        path: '/checkout', 
        // Protegemos el checkout (el usuario debe estar logueado)
        element: ( <RutaProtegida> <Checkout /> </RutaProtegida> ) 
      },
      { 
        path: '/pago-exitoso/:ordenId', // Ruta dinámica para mostrar ID
        element: ( <RutaProtegida> <PagoExitoso /> </RutaProtegida> ) 
      },
      { 
        path: '/pago-error', 
        element: ( <RutaProtegida> <PagoError /> </RutaProtegida> ) 
      },
    ],
  },
]);

// --- RENDERIZADO DE LA APLICACIÓN ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);