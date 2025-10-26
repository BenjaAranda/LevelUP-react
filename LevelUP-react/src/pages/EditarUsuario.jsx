// En: src/pages/EditarUsuario.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
// --- CORRECCIÓN ---
// ASEGÚRATE DE QUE ESTA SEA LA ÚNICA LÍNEA QUE IMPORTA ESTAS FUNCIONES
import { getUsuarios, actualizarUsuarioAdmin } from '../data/usuarios.js';
// --- FIN CORRECCIÓN ---
import '../styles/crearProducto.css'; // Reutilizamos estilos

const EditarUsuario = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(''); // Mantenido como string para input, convertir a número al guardar

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Cargar datos del usuario a editar
  useEffect(() => {
    try {
        // Usamos la función importada UNA SOLA VEZ
        const usuarios = getUsuarios();
        const userToEdit = usuarios.find(u => u.email === email);
        if (userToEdit) {
            setUsuario(userToEdit);
            setNombre(userToEdit.nombre || '');
            // Convertimos a string para el input
            setEdad(userToEdit.edad ? String(userToEdit.edad) : '');
        } else {
            setError('Usuario no encontrado.');
        }
    } catch(e) {
        setError('Error al cargar datos del usuario.');
        console.error(e);
    }
  }, [email]); // Dependencia correcta

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    const edadNumero = Number(edad); // Convertir edad a número para validación
    if (!nombre.trim() || !edad || isNaN(edadNumero) || edadNumero < 18) {
      setError('El nombre es requerido y la edad debe ser un número mayor o igual a 18.');
      return;
    }

    const usuarioActualizado = {
      ...usuario, // Mantenemos email, password, isAdmin, etc.
      nombre: nombre.trim(),
      edad: edadNumero // Guardamos la edad como número
    };

    try {
      actualizarUsuarioAdmin(usuarioActualizado); // Usamos la función importada
      setMensaje('¡Usuario actualizado con éxito!');
      setTimeout(() => {
        navigate('/admin/gestionar-usuarios');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el usuario.');
    }
  };

  if (!usuario && !error) return <Container className="my-5"><Alert variant="info">Cargando...</Alert></Container>;
  // Corregido: Mostrar error si existe, incluso si usuario es null al principio
  if (error) {
     return (
        <Container className="my-5">
            <Alert variant="danger">{error}</Alert>
             <Link to="/admin/gestionar-usuarios">
                <Button variant="secondary">Volver a Usuarios</Button>
            </Link>
        </Container>
     );
  }
   // Si no hay usuario después de cargar y sin error explícito (caso raro)
  if (!usuario) return <Container className="my-5"><Alert variant="warning">No se pudo cargar el usuario.</Alert></Container>;


  return (
    <Container className="crear-producto-container my-5"> {/* Reutiliza clase */}
      <Card>
        <Card.Header as="h2">Editar Usuario: {usuario?.email}</Card.Header>
        <Card.Body>
          <Link to="/admin/gestionar-usuarios">
            <Button variant="outline-secondary" className="mb-3">← Volver a Usuarios</Button>
          </Link>

          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}

            <Form.Group className="mb-3" controlId="emailUsuario">
              <Form.Label>Email (No editable)</Form.Label>
              <Form.Control type="email" value={email} readOnly disabled />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombreUsuario">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="edadUsuario">
              <Form.Label>Edad *</Form.Label>
              <Form.Control
                type="number"
                min="18"
                value={edad} // El valor es string aquí
                onChange={(e) => setEdad(e.target.value)} // Guardamos como string
                required
                className="no-spinners"
              />
            </Form.Group>

            {/* Opcional: Mostrar rol y descuento (no editables aquí) */}
             <p><small>Rol: {usuario?.isAdmin ? 'Administrador' : 'Cliente'}</small></p>
             <p><small>Descuento Duoc: {usuario?.descuento ? 'Sí' : 'No'}</small></p>


            <Button variant="success" type="submit">Guardar Cambios</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditarUsuario;