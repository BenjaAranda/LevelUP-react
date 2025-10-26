// En: src/context/AuthProvider.jsx (Simplificado)

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
// 1. IMPORTAMOS funciones de usuarios y productos
import { getUsuarios, saveUsuarios } from '../data/usuarios.js'; // <- Importa de usuarios.js
import { getProductos } from '../data/productos.js'; // <- Solo getProductos

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // --- INICIALIZACIÓN DE DATOS ---
    // Asegura que los usuarios iniciales existan (usa la lógica dentro de getUsuarios)
    getUsuarios(); 
    // Asegura que los productos iniciales existan (usa la lógica dentro de getProductos)
    getProductos(); 
    
    // --- Cargar Usuario Activo ---
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error("Error al parsear usuario activo:", error);
        localStorage.removeItem('usuarioActivo'); 
      }
    }
  }, []); // Se ejecuta solo una vez al inicio

  const login = (userData) => {
    setUsuario(userData);
    localStorage.setItem('usuarioActivo', JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioActivo');
  };

  // 2. Ya no necesitamos pasar getUsuarios aquí, los componentes lo importan directo
  const value = { usuario, login, logout }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};