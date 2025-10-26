// En: src/pages/HomeAdmin.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Button, Card } from 'react-bootstrap';
// Importamos el CSS específico
import '../styles/homeAdmin.css';
// Importamos el icono para usuarios (asegúrate de tener react-icons instalado)
import { FaUsers } from 'react-icons/fa';

const HomeAdmin = () => {
  const { usuario } = useAuth();

  return (
    // Aplicamos la clase contenedora principal
    <Container className="admin-home-container my-5">
      <Card>
        <Card.Header as="h1">Panel de Administración</Card.Header>
        <Card.Body>
          <Card.Title>Bienvenido, {usuario?.nombre || 'Admin'}</Card.Title>
          <Card.Text>
            Selecciona una opción para gestionar la tienda.
          </Card.Text>

          {/* Contenedor de acciones */}
          <div className="admin-actions">
            {/* Link a Crear Producto */}
            <Link to="/admin/crear-producto">
              <Button variant="primary" size="lg"> ➕ Agregar Producto </Button>
            </Link>
            {/* Link a Ver Productos */}
            <Link to="/admin/ver-productos">
              <Button variant="secondary" size="lg"> 📦 Ver/Modificar Productos </Button>
            </Link>
            {/* Link a Gestionar Destacados */}
            <Link to="/admin/gestionar-destacados">
              <Button variant="info" size="lg"> ⭐ Gestionar Destacados </Button>
            </Link>
            {/* Link a Productos Críticos */}
            <Link to="/admin/productos-criticos">
              <Button variant="danger" size="lg"> ⚠️ Productos Críticos </Button>
            </Link>
            {/* Link a Gestionar Categorías */}
            <Link to="/admin/gestionar-categorias">
              <Button variant="warning" size="lg" className="text-dark">
                🏷️ Gestionar Categorías
              </Button>
            </Link>
            {/* Link a Gestionar Usuarios */}
            <Link to="/admin/gestionar-usuarios">
              <Button variant="light" size="lg">
                 <FaUsers /> Gestionar Usuarios
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomeAdmin;