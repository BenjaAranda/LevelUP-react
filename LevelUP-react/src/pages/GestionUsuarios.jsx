// En: src/pages/GestionUsuarios.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';
// --- CORRECCIÓN ---
// Importamos funciones SOLO desde ../data/usuarios.js
import { getUsuarios, eliminarUsuarioAdmin } from '../data/usuarios.js';
// --- FIN CORRECCIÓN ---
import { useAuth } from '../hooks/useAuth.jsx';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
// Reutilizamos estilos de verProductosAdmin para la tabla
import '../styles/verProductosAdmin.css';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const { usuario: adminActual } = useAuth(); // Para evitar que el admin se borre a sí mismo
  
  useGoBackOnEsc();

  // Cargar usuarios al inicio
  useEffect(() => {
    cargarListaUsuarios();
  }, []);

  const cargarListaUsuarios = () => {
      try {
          // Usa la función importada correctamente
          setUsuarios(getUsuarios());
      } catch(e) {
          setError("Error al cargar la lista de usuarios.");
          console.error(e);
      }
  };

  const handleEliminar = (email, nombre) => {
    setError('');
    setMensaje('');

    // Prevenir auto-eliminación
    if (adminActual && email === adminActual.email) {
        setError("No puedes eliminar tu propia cuenta de administrador.");
        return;
    }
    // Prevenir eliminar admins principales
    if (email === "admin@levelup.com" || email === "exsairs@gmail.com") {
        setError("No se puede eliminar a los administradores principales.");
        return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${nombre}" (${email})?`)) {
      try {
        // Usa la función importada correctamente
        const listaActualizada = eliminarUsuarioAdmin(email);
        setUsuarios(listaActualizada);
        setMensaje(`Usuario "${nombre}" eliminado.`);
      } catch (err) {
        setError(err.message || 'Error al eliminar el usuario.');
      }
    }
  };

  return (
    <Container className="ver-productos-admin-container my-5"> {/* Reutiliza clase */}
      <Card>
        <Card.Header as="h2">Gestionar Usuarios</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>

          {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Table responsive striped bordered hover variant="dark" className="mt-3">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Rol</th>
                <th>Descuento Duoc</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No hay usuarios registrados.</td></tr>
              ) : (
                usuarios.map(user => (
                  <tr key={user.email}>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>{user.edad || 'N/A'}</td>
                    <td>{user.isAdmin ? 'Administrador' : 'Cliente'}</td>
                    <td>{user.descuento ? 'Sí (20%)' : 'No'}</td>
                    <td className="admin-producto-acciones">
                       {/* Link a la página de edición */}
                       <Link to={`/admin/editar-usuario/${encodeURIComponent(user.email)}`}>
                           <Button variant="warning" size="sm" title="Editar">✏️</Button>
                       </Link>
                       {/* Botón Eliminar (deshabilitado para admins principales o uno mismo) */}
                       <Button
                           variant="danger"
                           size="sm"
                           title="Eliminar"
                           onClick={() => handleEliminar(user.email, user.nombre)}
                           disabled={user.email === "admin@levelup.com" || user.email === "exsairs@gmail.com" || (adminActual && user.email === adminActual.email)}
                       >
                           🗑️
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default GestionUsuarios;