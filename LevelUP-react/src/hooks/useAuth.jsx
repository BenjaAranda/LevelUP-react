// En: src/hooks/useAuth.jsx

import { useContext } from 'react';
// Importamos el Contexto del otro archivo
import { AuthContext } from '../context/AuthContext';

// 3. Crear y EXPORTAR el Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext); 
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};