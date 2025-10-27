// En: src/App.jsx (Actualizado con Toast Global)

import React, { useEffect } from 'react'; // Importamos useEffect
import { Outlet } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
import AppFooter from './components/AppFooter.jsx';
// 1. Importamos el hook useCart y el CSS del toast
import { useCart } from './hooks/useCart.jsx';
import './styles/toast.css';
// 2. Importamos un ícono para el toast
import { FaCheckCircle } from 'react-icons/fa';

// --- Componente Toast (definido aquí mismo para simpleza) ---
const AddToCartToast = ({ message, onEnd }) => {
  useEffect(() => {
    // 3. Temporizador para ocultar el toast.
    // 3000ms = 3 segundos (coincide con la animación CSS)
    const timer = setTimeout(() => {
      onEnd(); // Llama a clearToast()
    }, 3000);

    // Limpiamos el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [message, onEnd]); // Dependencias: se reinicia si el mensaje cambia

  if (!message) return null; // No renderizar si no hay mensaje

  return (
    <div className="toast-notification">
      <FaCheckCircle />
      <span>¡Añadido! <strong>{message}</strong></span>
    </div>
  );
};


function App() {
  // 4. Obtenemos el estado del toast desde el contexto
  const { toastMessage, clearToast } = useCart() || {}; // Añadimos fallback por si acaso

  return (
    <>
      <AppNavbar />

      <main className="py-3">
        {/* El Outlet renderiza la página actual (Home, Productos, etc.) */}
        <Outlet />
      </main>

      <AppFooter />

      {/* --- 5. RENDERIZAMOS EL TOAST GLOBAL --- */}
      {/* Usamos una 'key' que cambia (Date.now()) para forzar 
        que el componente se remonte y la animación se reinicie
        cada vez que 'toastMessage' cambia.
      */}
      {toastMessage && (
         <AddToCartToast 
            key={Date.now()} 
            message={toastMessage} 
            onEnd={clearToast} 
         />
      )}
    </>
  );
}

export default App;