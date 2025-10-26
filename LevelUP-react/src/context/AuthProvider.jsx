import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getUsuarios, saveUsuarios } from '../data/usuarios.js';
import { getProductos } from '../data/productos.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Inicializar datos
    getUsuarios();
    getProductos();
    
    // Cargar usuario
    try {
      const savedUser = localStorage.getItem('usuarioActivo') || localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Migrate old storage key to new one
        if (localStorage.getItem('usuarioActivo')) {
          localStorage.setItem('user', savedUser);
          localStorage.removeItem('usuarioActivo');
        }
      }
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('user');
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('usuarioActivo', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = { 
    user, 
    login, 
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};