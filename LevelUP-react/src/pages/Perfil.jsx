import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setUserData({
        ...userData,
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

  const validatePasswordForm = () => {
    const errors = {};
    if (!userData.currentPassword) errors.currentPassword = 'La contraseña actual es requerida';
    if (!userData.newPassword) errors.newPassword = 'La nueva contraseña es requerida';
    if (userData.newPassword && userData.newPassword.length < 8) {
      errors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres';
    }
    if (!userData.confirmPassword) errors.confirmPassword = 'Debe confirmar la nueva contraseña';
    if (userData.newPassword !== userData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    
    // Validate email format on change
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

    // Actualizamos user en localStorage
    const { currentPassword, newPassword, confirmPassword, ...profileData } = userData;
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    updateUser(updatedUser);
    setSuccessMessage('Perfil actualizado con éxito');
    setErrors({});
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Aquí iría la lógica para cambiar la contraseña en el servidor
    // Por ahora solo mostramos mensaje de éxito y limpiamos el formulario
    setSuccessMessage('Contraseña actualizada con éxito');
    setShowPasswordForm(false);
    setUserData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setErrors({});
  };

  if (loading || !user) {
    return <p>Cargando...</p>;
  }

  return (
    <Container className="py-5">
      <h1>Mi Perfil</h1>
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={userData.nombre}
            onChange={handleChange}
            data-testid="nombre-input"
            isInvalid={!!errors.nombre}
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
          />
        </Form.Group>

        <Button type="submit">Guardar cambios</Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          Cambiar contraseña
        </Button>
      </Form>

      {showPasswordForm && (
        <Form onSubmit={handlePasswordSubmit}>
          <h3>Cambiar contraseña</h3>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor="currentPassword">Contraseña actual</Form.Label>
            <Form.Control
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={userData.currentPassword}
              onChange={handleChange}
              isInvalid={!!errors.currentPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.currentPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="newPassword">Nueva contraseña</Form.Label>
            <Form.Control
              id="newPassword"
              type="password"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChange}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirmPassword">Confirmar contraseña</Form.Label>
            <Form.Control
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit">Actualizar contraseña</Button>
        </Form>
      )}
    </Container>
  );
};

export default Perfil;