import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx'; 
import '../styles/login.css'; 
import client from '../api/axiosClient'; // Para el registro directo
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import BotonVolver from '../components/BotonVolver';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  useGoBackOnEsc();

  // Estados
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regNombre, setRegNombre] = useState('');
  const [regEdad, setRegEdad] = useState(18);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Lógica de Redirección Centralizada ---
  const redirectUser = () => {
      let user = null;
      try {
          user = JSON.parse(localStorage.getItem('user'));
      } catch (e) { console.error("Error parsing user", e); }

      if (user && (user.role === 'ADMIN' || user.isAdmin === true)) {
          navigate("/admin/home");
      } else {
          navigate("/"); // Redirigir al Home por defecto
      }
  };

  // --- REGISTRO CON AUTO-LOGIN ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    setLoading(true);

    if (regEdad < 18) {
      setRegisterError("Debes tener al menos 18 años para registrarte.");
      setLoading(false);
      return;
    }
    
    const nuevoUsuario = { 
        nombre: regNombre, 
        edad: parseInt(regEdad), 
        email: regEmail, 
        password: regPassword 
    };
    
    try {
        // 1. Registrar usuario en backend
        await client.post('/auth/register', nuevoUsuario);
        
        // 2. Mensaje de éxito (breve)
        setRegisterSuccess('¡Registro exitoso! Iniciando sesión...');
        
        // 3. AUTO-LOGIN: Iniciar sesión automáticamente con las credenciales
        const loginResult = await login(regEmail, regPassword);
        
        if (loginResult.success) {
            // Pequeña pausa para que el usuario lea el mensaje
            setTimeout(() => {
                redirectUser();
            }, 1500);
        } else {
            // Si el registro funcionó pero el login falló (raro), mandamos al login manual
            setRegisterSuccess('Registro exitoso. Por favor inicia sesión manualmente.');
            setActiveTab('login');
            setLoginEmail(regEmail); // Pre-llenar email
            setLoginPassword('');
            setLoading(false);
        }

    } catch (err) {
        console.error("Error registro:", err);
        setRegisterError(err.response?.data?.message || "Error al registrar. El correo podría estar en uso.");
        setLoading(false);
    }
  };

  // --- LOGIN MANUAL ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
        const result = await login(loginEmail, loginPassword);
        
        if (result.success) {
            redirectUser();
        } else {
            setLoginError(result.message || "Correo o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error inesperado en login:", error);
        setLoginError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
        // Importante: Si redirigimos, el componente se desmonta y esto no afecta.
        // Si NO redirigimos (error), esto apaga el spinner.
        setLoading(false);
    }
  };

  return (
     <div className="login-wrapper"> 
       <div className="container-login"> 
        
        <BotonVolver /> 
        
        <h1>Bienvenido a Level-Up Gamer</h1>

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
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
              </form>
            </div>
          ) : (
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
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? 'Procesando...' : 'Registrarse'}
                </button>
              </form>
            </div>
          )}
        </div>

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