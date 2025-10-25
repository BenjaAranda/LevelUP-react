// En: src/context/AuthProvider.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
// --- CORRECCIÓN ---
// Solo importamos las funciones que SÍ se exportan desde productos.js
import { getProductos, saveProductos } from '../data/productos.js'; 
// --- FIN CORRECCIÓN ---

// Funciones Helper de USUARIOS (se mantienen igual)
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
const saveUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // --- INICIALIZACIÓN DE DATOS ---

    // --- Cargar/Crear Usuarios ---
    const usuarios = getUsuarios();
    let usuariosUpdated = false;
    if (!usuarios.some(u => u.email === "admin@levelup.com")) {
      usuarios.push({ nombre: "Admin", email: "admin@levelup.com", password: "admin123", isAdmin: true, edad: 99 }); 
      usuariosUpdated = true;
    }
     if (!usuarios.some(u => u.email === "benjaprogramador@gmail.com")) {
       usuarios.push({ nombre: "Benja", edad: 20, email: "benjaprogramador@gmail.com", password: "Contraseña123", descuento: false, isAdmin: false });
       usuariosUpdated = true;
     }
     if (!usuarios.some(u => u.email === "estudianteDuoc@duocuc.cl")) {
       usuarios.push({ nombre: "Estudiante DUOC", edad: 20, email: "estudianteDuoc@duocuc.cl", password: "Contraseña123", descuento: true, isAdmin: false });
       usuariosUpdated = true;
     }
    if (usuariosUpdated) {
      saveUsuarios(usuarios);
      console.log("AuthProvider: Usuarios iniciales creados/actualizados.");
    }

    // --- Cargar/Crear Productos ---
    // Simplemente llamamos a getProductos(). Esta función ya maneja la lógica 
    // de cargar desde localStorage o usar/guardar los iniciales si es necesario.
    // No necesitamos importar 'productosIniciales' aquí.
    const productosActuales = getProductos(); 
    console.log("AuthProvider: Productos cargados/inicializados.", productosActuales);
    
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

  const value = { usuario, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};