import React, { useEffect } from 'react'; 
import { Outlet } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
import AppFooter from './components/AppFooter.jsx';
// Importamos el hook useCart y el CSS del toast
import { useCart } from './hooks/useCart.jsx';
import './styles/toast.css';
// Importamos un ícono para el toast (asegúrate de tener react-icons instalado: npm install react-icons)
// Si no tienes react-icons, puedes quitar el ícono o usar un emoji ✅
import { FaCheckCircle } from 'react-icons/fa';

// --- Componente Toast Interno ---
const AddToCartToast = ({ message, onEnd }) => {
  useEffect(() => {
    // Temporizador para ocultar el toast a los 3 segundos
    const timer = setTimeout(() => {
      onEnd(); // Llama a clearToast() del contexto
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onEnd]);

  if (!message) return null;

  return (
    <div className="toast-notification">
      <FaCheckCircle />
      <span>¡Añadido! <strong>{message}</strong></span>
    </div>
  );
};

function App() {
  // Obtenemos el estado del toast desde el contexto
  // El fallback || {} evita errores si el contexto aún no carga
  const { toastMessage, clearToast } = useCart() || {}; 

  return (
    <>
      <AppNavbar />

      <main className="py-3" style={{ minHeight: '80vh' }}>
        {/* El Outlet renderiza la página hija correspondiente a la ruta actual */}
        <Outlet />
      </main>

      <AppFooter />

      {/* --- RENDERIZADO DEL TOAST GLOBAL --- */}
      {toastMessage && (
         <AddToCartToast 
            key={Date.now()} // Fuerza reinicio de animación al cambiar mensaje
            message={toastMessage} 
            onEnd={clearToast} 
         />
      )}
    </>
  );
}

export default App;