import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

// Componente Spinner simple para la carga
const LoadingScreen = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#050505', color: '#fff' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

const RutaProtegida = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();

  // 1. Si está cargando, NO redirigimos todavía. Esperamos.
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. Si terminó de cargar y no hay usuario logueado, al Login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Verificación de Roles para el Panel
  if (requireAdmin) {
    // Definimos quiénes son "Personal Autorizado" para entrar al panel
    const esPersonalAutorizado = 
        user.role === 'ADMIN' || 
        user.role === 'VENDEDOR' || 
        user.isAdmin === true; // (Compatibilidad legacy)

    // Si requiere admin pero el usuario NO es ni Admin ni Vendedor -> Al Home público
    if (!esPersonalAutorizado) {
      return <Navigate to="/" replace />;
    }
  }

  // 4. Todo bien, mostramos la página.
  return children;
};

export default RutaProtegida;