import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import client from '../api/axiosClient'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import '../styles/gestionUsuarios.css';

const GestionUsuarios = () => {
  useGoBackOnEsc(); // Te permite volver con ESC

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Cargar Usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await client.get('/users');
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con la base de datos.');
      setLoading(false);
    }
  };

  // 2. Eliminar Usuario
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

    try {
      await client.delete(`/users/${id}`);
      setSuccessMsg('Usuario eliminado correctamente.');
      // Recargar lista
      cargarUsuarios();
      // Ocultar mensaje luego de 3 seg
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el usuario.');
    }
  };

  // Helper para icono de rol
  const getRoleIcon = (role) => {
    if (role === 'ADMIN') return <FaUserShield className="text-danger" title="Admin" />;
    if (role === 'VENDEDOR') return <FaUserTie className="text-warning" title="Vendedor" />;
    return <FaUser className="text-info" title="Cliente" />;
  };

  return (
    <Container fluid className="gestion-users-container">
      <div className="users-panel-frame">
        <h1 className="users-title">BASE DE DATOS DE <span className="neon-green">USUARIOS</span></h1>

        {error && <Alert variant="danger" className="gamer-alert">{error}</Alert>}
        {successMsg && <Alert variant="success" className="gamer-alert">{successMsg}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="info" />
          </div>
        ) : (
          <div className="table-responsive gamer-table-wrapper">
            <Table hover className="gamer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ROL</th>
                  <th>NOMBRE</th>
                  <th>EMAIL</th>
                  <th>EDAD</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td className="id-col">#{u.id}</td>
                    <td className="text-center">{getRoleIcon(u.role)} <small>{u.role}</small></td>
                    <td className="fw-bold text-white">{u.nombre}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>{u.edad}</td>
                    <td>
                      <div className="action-buttons">
                        {/* BOTÓN EDITAR: Pasa el ID en la URL */}
                        <Link to={`/admin/editar-usuario/${u.id}`}>
                          <Button variant="outline-success" size="sm" className="btn-action">
                            <FaEdit />
                          </Button>
                        </Link>
                        
                        {/* BOTÓN ELIMINAR */}
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="btn-action"
                          onClick={() => handleDelete(u.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        <div className="mt-4 text-center">
            <Link to="/admin/home" className="btn-return">VOLVER AL PANEL</Link>
        </div>
      </div>
    </Container>
  );
};

export default GestionUsuarios;