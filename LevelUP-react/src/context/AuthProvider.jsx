// En: src/context/AuthProvider.jsx

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// --- Funciones Helper de USUARIOS ---
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
const saveUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));

// --- Funciones Helper de PRODUCTOS ---
const getProductos = () => JSON.parse(localStorage.getItem("productos")) || [];
const saveProductos = (productos) => localStorage.setItem("productos", JSON.stringify(productos));

// --- PRODUCTOS DE PRUEBA (SOLO LA POLERA) ---
const productosDePrueba = [
  { 
    codigo: "PP001", 
    categoria: "Poleras Personalizadas", 
    nombre: "Polera Gamer 'Level-Up'", 
    precio: 14990, 
    descripcion: "Polera personalizada con diseño gamer exclusivo.", 
    stock: 25, 
    imagen: "/img_productos/Polera Gamer 'Level-Up'.png" 
  }
];

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // --- LÓGICA DE CREACIÓN DE DATOS (Usuarios y Productos) ---
  useEffect(() => {
    // --- Cargar Usuarios ---
    const usuarios = getUsuarios();
    let usuariosUpdated = false;
    if (!usuarios.some(u => u.email === "admin@levelup.com")) {
      usuarios.push({ nombre: "Admin", email: "admin@levelup.com", password: "admin123", isAdmin: true });
      usuariosUpdated = true;
    }
    // ... (tus otros usuarios de prueba) ...
    if (usuariosUpdated) {
      saveUsuarios(usuarios);
    }
    
    // --- Cargar Productos ---
    const productos = getProductos();
    if (productos.length === 0) { // Si no hay productos, carga los de prueba
      saveProductos(productosDePrueba);
    }
    
    // Cargar usuario activo
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