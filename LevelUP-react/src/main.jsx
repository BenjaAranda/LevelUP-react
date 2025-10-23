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
import './styles/carrito.css'; // <-- 1. IMPORTAMOS CSS CARRITO
import './index.css';

// --- CONTEXTO ---
import { CartProvider } from './hooks/useCart.jsx';
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
import Login from './pages/Login.jsx'; 
import Perfil from './pages/Perfil.jsx'; 
import Carrito from './pages/Carrito.jsx'; // <-- 2. IMPORTAMOS CARRITO

// --- CONFIGURACIÓN DEL ROUTER ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { path: '/', element: <Home /> },
      { path: '/productos', element: <Productos /> },
      { path: '/producto/:codigo', element: <DetalleProducto /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/contacto', element: <Contacto /> }, 
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <div><h1>Detalle Blog (WIP)</h1></div> }, 
      { path: '/login', element: <Login /> },
      { 
        path: '/perfil', 
        element: (
          <RutaProtegida>
            <Perfil />
          </RutaProtegida>
        ) 
      },
      // --- 3. RUTA CARRITO AÑADIDA ---
      { path: '/carrito', element: <Carrito /> }, 
      
      // (Placeholder para checkout)
      { path: '/checkout', element: <div><h1>Página Checkout (en construcción)</h1></div> },
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