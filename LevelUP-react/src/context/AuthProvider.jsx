import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import client from '../api/axiosClient'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Intentamos recuperar la sesión si el usuario recarga la página
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error restaurando sesión:", error);
      localStorage.clear(); // Limpiamos si hay datos corruptos
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      
      // Extraemos el token y los datos del usuario
      const { token, ...userDataBackend } = response.data;
      const userData = { email, ...userDataBackend };

      // Guardamos en el estado y en localStorage
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Retornamos éxito para que el frontend sepa que funcionó
      return { success: true };
    } catch (error) {
      console.error("Error Login:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Credenciales incorrectas" 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    // Redirigimos forzosamente al login
    window.location.href = '/login';
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
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};