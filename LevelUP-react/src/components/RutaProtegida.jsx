// src/components/RutaProtegida.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- (Este es el Context que tendrías que crear)

// 'children' es el componente que queremos proteger (ej: <MiPerfil />)
const RutaProtegida = ({ children }) => {
  
  // Asumimos que tu AuthContext te da el 'usuario'
  const { usuario, cargando } = useAuth(); 

  // Si está cargando la info del usuario, mostramos un 'loading...'
  if (cargando) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, lo mandamos al login
  if (!usuario) {
    // 'replace' evita que el usuario pueda volver atrás con la flecha del navegador
    return <Navigate to="/login" replace />; 
  }

  // Si hay usuario, simplemente mostramos el componente (children)
  return children;
};

export default RutaProtegida;