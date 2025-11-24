import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- ESTILOS GLOBALES ---
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 
// Importa tus estilos personalizados aquí si es necesario, pero asegúrate que existan
// Si alguno da error 404, coméntalo temporalmente
import './styles/main.css';
import './styles/toast.css';

// --- CONTEXTOS ---
import { CartProvider } from './context/CartProvider.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';

// --- LAYOUT Y COMPONENTES ---
import App from './App.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';

// --- PÁGINAS (Asegúrate que los nombres de archivo coincidan EXACTAMENTE) ---
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
import Checkout from './pages/Checkout.jsx';
import PagoExitoso from './pages/PagoExitoso.jsx';
import PagoError from './pages/PagoError.jsx';

// Admin Pages
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App es el layout padre
    errorElement: <div className="text-center mt-5"><h1>404 - Página no encontrada</h1><a href="/">Volver al inicio</a></div>,
    children: [
      // Rutas Públicas
      { index: true, element: <Home /> }, // index: true es lo mismo que path: '/'
      { path: 'productos', element: <Productos /> },
      { path: 'producto/:codigo', element: <DetalleProducto /> },
      { path: 'nosotros', element: <Nosotros /> },
      { path: 'contacto', element: <Contacto /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <DetalleBlog /> },
      { path: 'login', element: <Login /> },
      { path: 'carrito', element: <Carrito /> },
      { path: 'admin-login', element: <AdminLogin /> },

      // Rutas Protegidas (Cliente)
      { 
        path: 'perfil', 
        element: <RutaProtegida><Perfil /></RutaProtegida> 
      },
      { 
        path: 'checkout', 
        element: <RutaProtegida><Checkout /></RutaProtegida> 
      },
      { 
        path: 'pago-exitoso/:ordenId', 
        element: <RutaProtegida><PagoExitoso /></RutaProtegida> 
      },
      { 
        path: 'pago-error', 
        element: <RutaProtegida><PagoError /></RutaProtegida> 
      },

      // Rutas Protegidas (Admin)
      { path: 'admin/home', element: <RutaProtegida requireAdmin={true}><HomeAdmin /></RutaProtegida> },
      { path: 'admin/crear-producto', element: <RutaProtegida requireAdmin={true}><CrearProducto /></RutaProtegida> },
      { path: 'admin/ver-productos', element: <RutaProtegida requireAdmin={true}><VerProductosAdmin /></RutaProtegida> },
      { path: 'admin/editar-producto/:codigo', element: <RutaProtegida requireAdmin={true}><EditarProducto /></RutaProtegida> },
      { path: 'admin/gestionar-destacados', element: <RutaProtegida requireAdmin={true}><GestionDestacados /></RutaProtegida> },
      { path: 'admin/productos-criticos', element: <RutaProtegida requireAdmin={true}><ProductosCriticos /></RutaProtegida> },
      { path: 'admin/gestionar-categorias', element: <RutaProtegida requireAdmin={true}><GestionCategorias /></RutaProtegida> },
      { path: 'admin/gestionar-usuarios', element: <RutaProtegida requireAdmin={true}><GestionUsuarios /></RutaProtegida> },
      { path: 'admin/editar-usuario/:email', element: <RutaProtegida requireAdmin={true}><EditarUsuario /></RutaProtegida> },
      { path: 'admin/gestionar-ordenes', element: <RutaProtegida requireAdmin={true}><GestionOrdenes /></RutaProtegida> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);