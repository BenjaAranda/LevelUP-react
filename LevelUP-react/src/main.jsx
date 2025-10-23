// En: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/productos.css'; // (Asegúrate que todos tus CSS estén aquí)
import './styles/detalle-producto.css';
import './index.css';

// Contexto
import { CartProvider } from './hooks/useCart.jsx';

// Layout
import App from './App.jsx';

// --- Páginas ---
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
// (Aquí puedes crear archivos placeholder para las nuevas páginas)
// import Nosotros from './pages/Nosotros.jsx';
// import Contacto from './pages/Contacto.jsx';
// import Blog from './pages/Blog.jsx';
// import Login from './pages/Login.jsx';

// Configuración del Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { path: '/', element: <Home /> },
      { path: '/productos', element: <Productos /> },
      { path: '/producto/:codigo', element: <DetalleProducto /> },
      
      // --- NUEVAS RUTAS AÑADIDAS ---
      // (Estos componentes aún no existen, pero las rutas ya están listas)
      
      // { path: '/nosotros', element: <Nosotros /> },
      // { path: '/contacto', element: <Contacto /> },
      // { path: '/blog', element: <Blog /> },
      // { path: '/login', element: <Login /> },

      // (Ruta temporal para que no se rompa)
      { path: '/nosotros', element: <div><h1>Página Nosotros (en construcción)</h1></div> },
      { path: '/contacto', element: <div><h1>Página Contacto (en construcción)</h1></div> },
      { path: '/blog', element: <div><h1>Página Blog (en construcción)</h1></div> },
      { path: '/login', element: <div><h1>Página Login (en construcción)</h1></div> },
    ],
  },
]);

// Renderizado de la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);