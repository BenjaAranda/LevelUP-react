// En: src/pages/HomeAdmin.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Button, Card } from 'react-bootstrap';
import '../styles/homeAdmin.css'; 

const HomeAdmin = () => {
  const { usuario } = useAuth();

  return (
    <Container className="admin-home my-5">
      <Card>
        <Card.Header as="h1">Panel de Administración</Card.Header>
        <Card.Body>
          <Card.Title>Bienvenido, {usuario?.nombre || 'Admin'}</Card.Title>
          <Card.Text>
            Selecciona una opción para gestionar la tienda.
          </Card.Text>
          
          <div className="admin-actions">
            <Link to="/admin/crear-producto">
              <Button variant="primary" size="lg">
                ➕ Agregar Producto
              </Button>
            </Link>
            <Link to="/admin/ver-productos">
              <Button variant="secondary" size="lg">
                📦 Ver/Modificar Productos
              </Button>
            </Link>
            {/* --- ¡BOTÓN NUEVO! --- */}
            <Link to="/admin/gestionar-destacados">
              <Button variant="info" size="lg">
                ⭐ Gestionar Destacados
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomeAdmin;