import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaClipboardList, FaBoxOpen, FaStar, FaExclamationTriangle, FaTags, FaPlusCircle } from 'react-icons/fa';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import '../styles/homeAdmin.css';

const HomeAdmin = () => {
  const { usuario } = useAuth();
  
  useGoBackOnEsc();

  return (
    <Container fluid className="admin-home-container">
      {/* Marco Principal Cyberpunk */}
      <div className="admin-panel-frame">
        
        {/* Cabecera */}
        <header className="admin-header">
          <h1 className="neon-text-purple">PANEL ADMIN</h1>
          <div className="admin-welcome">
            Bienvenido, <span className="neon-text-green">{usuario?.nombre || 'Admin'}</span>
          </div>
        </header>

        {/* Cuerpo dividido en 2 columnas como el dibujo */}
        <div className="admin-grid">
          <Row>
            {/* COLUMNA 1: PRODUCTOS */}
            <Col md={12} lg={6} className="mb-4">
              <div className="admin-section-card">
                <h2 className="section-title">Productos</h2>
                <div className="button-stack">
                  
                  <Link to="/admin/crear-producto" className="gamer-link">
                    <button className="btn-gamer">
                      <FaPlusCircle className="icon-left"/> Agregar Productos
                    </button>
                  </Link>

                  <Link to="/admin/ver-productos" className="gamer-link">
                    <button className="btn-gamer">
                      <FaBoxOpen className="icon-left"/> Ver/Modificar
                    </button>
                  </Link>

                  <Link to="/admin/productos-criticos" className="gamer-link">
                    <button className="btn-gamer">
                      <FaExclamationTriangle className="icon-left"/> Productos Críticos
                    </button>
                  </Link>

                  <Link to="/admin/gestionar-destacados" className="gamer-link">
                    <button className="btn-gamer">
                      <FaStar className="icon-left"/> Gestionar Destacados
                    </button>
                  </Link>

                  <Link to="/admin/gestionar-categorias" className="gamer-link">
                    <button className="btn-gamer">
                      <FaTags className="icon-left"/> Gestionar Categorías
                    </button>
                  </Link>

                </div>
              </div>
            </Col>

            {/* COLUMNA 2: VARIOS / GESTIÓN */}
            <Col md={12} lg={6} className="mb-4">
              <div className="admin-section-card">
                <h2 className="section-title">Varios</h2>
                <div className="button-stack">
                  
                  <Link to="/admin/gestionar-usuarios" className="gamer-link">
                    <button className="btn-gamer">
                      <FaUsers className="icon-left"/> Gestionar Usuarios
                    </button>
                  </Link>

                  <Link to="/admin/gestionar-ordenes" className="gamer-link">
                    <button className="btn-gamer">
                      <FaClipboardList className="icon-left"/> Gestionar Órdenes
                    </button>
                  </Link>

                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default HomeAdmin;