// En: src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx'; 
import '../styles/login.css'; 
import { findUsuarioParaLogin, emailExiste, agregarUsuario } from '../data/usuarios.js';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
// --- 1. IMPORTAMOS EL BOTÓN ---
import BotonVolver from '../components/BotonVolver';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  // Hook para la tecla "Esc" (ya lo tenías)
  useGoBackOnEsc();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regEdad, setRegEdad] = useState(18);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // ... (Toda tu lógica handleRegisterSubmit y handleLoginSubmit se mantiene igual) ...
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (regEdad < 18) {
      setRegisterError("Debes tener al menos 18 años para registrarte.");
      return;
    }
    if (emailExiste(regEmail)) { 
      setRegisterError("Este correo ya está registrado.");
      return;
    }
    let descuento = regEmail.endsWith("@duocuc.cl"); 
    const nuevoUsuario = { nombre: regNombre, edad: regEdad, email: regEmail, password: regPassword, descuento, isAdmin: false };
    
    try {
        agregarUsuario(nuevoUsuario); 
        setRegisterSuccess(`¡Registro exitoso! ${descuento ? 'Obtienes un 20% de descuento.' : ''} Ahora puedes iniciar sesión.`);
        setRegNombre(''); setRegEdad(18); setRegEmail(''); setRegPassword('');
    } catch (err) {
        setRegisterError(err.message || "Error al registrar el usuario.");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const usuario = findUsuarioParaLogin(loginEmail, loginPassword); 
    if (usuario) {
      login(usuario); 
      if (usuario.isAdmin) {
          navigate("/admin/home");
      } else {
          navigate("/perfil"); 
      }
    } else {
      setLoginError("Correo o contraseña incorrectos.");
    }
  };

  return (
     <div className="login-wrapper"> 
       <div className="container-login"> 
        
        {/* --- 2. BOTÓN AÑADIDO AQUÍ --- */}
        {/* (La clase 'mb-3' por defecto lo separará del título) */}
        <BotonVolver /> 
        
        <h1>Bienvenido a Level-Up Gamer</h1>

        {/* Tabs (Pestañas) */}
        <ul className="nav nav-tabs" id="loginTabs" role="tablist">
          <li className="nav-item">
            <button 
              className={activeTab === 'login' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('login')}
            >
              Iniciar Sesión
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={activeTab === 'register' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('register')}
            >
              Registrarse
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === 'login' ? (
            // --- Formulario de Iniciar Sesión ---
            <div id="login">
              <form id="loginForm" onSubmit={handleLoginSubmit}>
                {loginError && <div className="error-field">{loginError}</div>}
                
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Correo</label>
                  <input 
                    type="email" 
                    id="loginEmail" 
                    className="form-control" 
                    required 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    id="loginPassword" 
                    className="form-control" 
                    required 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
            </div>
          ) : (
            // --- Formulario de Registro ---
            <div id="register">
              <form id="registerForm" onSubmit={handleRegisterSubmit}>
                {registerError && <div className="error-field">{registerError}</div>}
                {registerSuccess && <div className="mensaje-exito">{registerSuccess}</div>}

                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" id="nombre" className="form-control" required value={regNombre} onChange={(e) => setRegNombre(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="edad" className="form-label">Edad</label>
                  <input type="number" id="edad" min="18" className="form-control" required value={regEdad} onChange={(e) => setRegEdad(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">Correo</label>
                  <input type="email" id="registerEmail" className="form-control" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">Contraseña</label>
                  <input type="password" id="registerPassword" className="form-control" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-success w-100">Registrarse</button>
              </form>
            </div>
          )}
        </div>

        {/* --- Botón para Admin --- */}
        <div className="text-center mt-4">
          <button id="adminLoginBtn" onClick={() => navigate("/admin-login")}>
            Iniciar sesión como Administrador
          </button>
        </div>

       </div>
     </div>
  );
};

export default Login;