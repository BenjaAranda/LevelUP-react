// En: src/components/RutaProtegida.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
// --- CORRECCIÓN ---
// Importamos el hook desde su archivo correcto
import { useAuth } from '../hooks/useAuth.jsx'; 

const RutaProtegida = ({ children }) => {
  // Ahora useAuth funcionará
  const { usuario } = useAuth(); 

  // (He quitado 'cargando' por simplicidad, tu hook no lo proveía)

  // Si no hay usuario, lo mandamos al login
  if (!usuario) {
    return <Navigate to="/login" replace />; 
  }

  // Si hay usuario, mostramos la página
  return children;
};

export default RutaProtegida;