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

  // 2. Si terminó de cargar y no hay usuario, al Login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si requiere admin y el usuario no lo es, al Home.
  if (requireAdmin && (user.role !== 'ADMIN' && user.isAdmin !== true)) {
    return <Navigate to="/" replace />;
  }

  // 4. Todo bien, mostramos la página.
  return children;
};

export default RutaProtegida;