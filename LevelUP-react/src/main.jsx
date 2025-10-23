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
import './styles/blog.css'; // <-- 1. IMPORTAMOS EL CSS DEL BLOG
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
import Blog from './pages/Blog.jsx'; // <-- 2. IMPORTAMOS LA PÁGINA

// (Placeholders)
// import Login from './pages/Login.jsx';

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
      
      // --- 3. RUTA ACTUALIZADA ---
      { path: '/blog', element: <Blog /> }, 

      // (Rutas placeholder temporales)
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