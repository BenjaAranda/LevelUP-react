import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import BotonVolver from '../components/BotonVolver';
import { FaTachometerAlt } from 'react-icons/fa'; 

const Perfil = () => {
  const { user, updateUser } = useAuth();
  // const navigate = useNavigate(); // No se usa explícitamente aquí aparte del Link, pero lo dejamos por si acaso
  const [loading, setLoading] = useState(true);
  
  useGoBackOnEsc();
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estado simplificado (sin password)
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: ''
  });

  useEffect(() => {
    if (user) {
      setUserData({
        nombre: user.nombre || '',
        email: user.email || '',
        direccion: user.direccion || '',
        telefono: user.telefono || ''
      });
      setLoading(false);
    }
  }, [user]); 

  const validateForm = () => {
    const errors = {};
    if (!userData.nombre) errors.nombre = 'El nombre es requerido';
    if (!userData.email) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Email inválido';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      if (!value) {
        setErrors(prev => ({ ...prev, email: 'El email es requerido' }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Email inválido' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Actualizamos solo los datos de perfil
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    updateUser(updatedUser);
    setSuccessMessage('Perfil actualizado con éxito');
    setErrors({});
  };

  if (loading || !user) {
    return <div className="text-center py-5 text-white"><p>Cargando perfil...</p></div>;
  }

  const esAdmin = user.role === 'ADMIN' || user.isAdmin === true;

  return (
    <Container className="py-5">
      
      <BotonVolver />

      <h1 className="mb-4 text-white">Mi Perfil</h1>
      
      {esAdmin && (
        <Link to="/admin/home" className="d-block mb-4 text-decoration-none">
          <Button variant="warning" className="w-100 fw-bold text-uppercase py-2 border border-dark">
            <FaTachometerAlt className="me-2" /> 
            Volver al Panel de Administrador
          </Button>
        </Link>
      )}
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      {/* Contenedor Oscuro (Dark Mode) */}
      <div className="bg-dark p-4 rounded shadow-sm border border-secondary text-white">
          <Form onSubmit={handleSubmit} className="mb-2">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={userData.nombre}
                onChange={handleChange}
                data-testid="nombre-input"
                isInvalid={!!errors.nombre}
                className="bg-secondary text-white border-secondary"
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                data-testid="email-input"
                isInvalid={!!errors.email}
                disabled 
                className="bg-secondary text-white border-secondary"
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={userData.direccion}
                onChange={handleChange}
                data-testid="direccion-input"
                className="bg-secondary text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={userData.telefono}
                onChange={handleChange}
                data-testid="telefono-input"
                className="bg-secondary text-white border-secondary"
              />
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
                <Button type="submit" variant="primary" className="w-100 fw-bold">Guardar cambios</Button>
            </div>
          </Form>
      </div>
    </Container>
  );
};

export default Perfil;