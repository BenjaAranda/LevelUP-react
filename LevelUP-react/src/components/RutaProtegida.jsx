// En: src/components/RutaProtegida.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx'; 

// --- ¡MODIFICADO! ---
// Ahora acepta una prop 'requireAdmin', que por defecto es 'false'
const RutaProtegida = ({ children, requireAdmin = false }) => {
  const { usuario } = useAuth(); 

  // 1. Chequeo básico: ¿Está logueado?
  if (!usuario) {
    // Si no está logueado, lo mandamos al login
    return <Navigate to="/login" replace />; 
  }

  // 2. Chequeo de Admin: ¿Esta ruta REQUIERE admin Y el usuario NO es admin?
  if (requireAdmin && !usuario.isAdmin) {
    // Es un usuario normal (logueado) intentando entrar a una ruta de admin.
    // Lo mandamos a la página de inicio (o a su perfil) para que no vea nada.
    return <Navigate to="/" replace />; 
  }

  // 3. Si todo está bien (está logueado Y tiene los permisos), mostramos la página
  return children;
};

export default RutaProtegida;