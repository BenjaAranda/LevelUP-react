// En: src/context/AuthProvider.jsx (¡NUEVO ARCHIVO!)

import React, { useState, useEffect } from 'react';
// Importa el contexto desde el archivo vecino
import { AuthContext } from './AuthContext';

// Este archivo SÓLO exporta el componente Proveedor
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const login = (userData) => {
    setUsuario(userData);
    localStorage.setItem('usuarioActivo', JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioActivo');
  };

  const value = {
    usuario,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};