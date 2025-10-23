// En: src/pages/Perfil.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx'; // Usamos el hook
import { Container, Button } from 'react-bootstrap';

const Perfil = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Si por alguna razón se llega aquí sin usuario (aunque está protegido)
  if (!usuario) {
    return <p>Cargando...</p>; 
  }

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige al Home después de cerrar sesión
  };

  return (
    // Reutilizamos los estilos del banner de contacto
    <section className="banner-contacto" style={{borderColor: '#8000ff'}}>
      <h1 style={{color: '#8000ff'}}>¡Bienvenido, {usuario.nombre}!</h1>
      
      <div style={{color: '#fff', marginTop: '20px'}}>
        <p><strong>Correo:</strong> {usuario.email}</p>
        <p><strong>Edad:</strong> {usuario.edad}</p>
        
        {/* Mensaje de descuento condicional */}
        {usuario.descuento && (
          <div className="mensaje-exito" style={{maxWidth: '400px', margin: '20px auto'}}>
            ¡Eres estudiante Duoc! Tienes un 20% de descuento.
          </div>
        )}

        <Button 
          variant="danger" 
          onClick={handleLogout} 
          className="mt-3"
        >
          Cerrar Sesión
        </Button>
      </div>
    </section>
  );
};

export default Perfil;