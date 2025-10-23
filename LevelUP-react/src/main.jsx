// En: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- ESTILOS ---
import 'bootstrap/dist/css/bootstrap.min.css';
// Importamos el archivo CSS principal que contiene TODOS los estilos
import './styles/main.css'; 
import './index.css';

// --- CONTEXTO ---
import { CartProvider } from './hooks/useCart.jsx';

// --- LAYOUT ---
import App from './App.jsx';

// --- PÁGINAS ---
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx'; 
import Blog from './pages/Blog.jsx'; // <-- 1. IMPORTAMOS LA PÁGINA BLOG

// (Placeholders para las páginas restantes)
// import Login from './pages/Login.jsx';
// import Carrito from './pages/Carrito.jsx';

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
      
      // --- 2. RUTA ACTUALIZADA ---
      { path: '/blog', element: <Blog /> }, // <-- Reemplaza el placeholder

      // (Rutas placeholder temporales para los links del Navbar/Footer)
      { path: '/login', element: <div><h1>Página Login (en construcción)</h1></div> },
      { path: '/carrito', element: <div><h1>Página Carrito (en construcción)</h1></div> },
    ],
  },
]);

// --- RENDERIZADO ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);