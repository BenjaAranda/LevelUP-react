// En: src/pages/GestionDestacados.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Alert, Row, Col } from 'react-bootstrap';
import '../styles/gestionDestacados.css'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const GestionDestacados = () => {
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  
  useGoBackOnEsc();

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const destacadosGuardados = JSON.parse(localStorage.getItem("destacados")) || [];
    setTodosLosProductos(productosGuardados);
    setDestacados(destacadosGuardados);
  }, []);

  const handleAgregar = (producto) => {
    if (destacados.some(p => p.codigo === producto.codigo)) return;
    const nuevosDestacados = [...destacados, producto];
    setDestacados(nuevosDestacados);
    localStorage.setItem("destacados", JSON.stringify(nuevosDestacados));
    setMensaje(`"${producto.nombre}" agregado a destacados.`);
  };

  const handleQuitar = (producto) => {
    const nuevosDestacados = destacados.filter(p => p.codigo !== producto.codigo);
    setDestacados(nuevosDestacados);
    localStorage.setItem("destacados", JSON.stringify(nuevosDestacados));
    setMensaje(`"${producto.nombre}" quitado de destacados.`);
  };

  const productosDisponibles = todosLosProductos.filter(
    p => !destacados.some(d => d.codigo === p.codigo)
  );

  return (
    // --- CLASE AÑADIDA AQUÍ ---
    <Container className="gestion-destacados-container my-5"> 
      <Card>
        <Card.Header as="h2">Gestionar Productos Destacados</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>
          {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}

          <Row>
            {/* Columna Disponibles */}
            <Col md={6}>
              <h3>Productos Disponibles</h3>
              <ListGroup className="lista-gestion">
                {productosDisponibles.length > 0 ? (
                  productosDisponibles.map(prod => (
                    <ListGroup.Item key={prod.codigo} className="item-gestion">
                      <img src={prod.imagen || prod.img} alt={prod.nombre} /> 
                      <span>{prod.nombre}</span>
                      <Button variant="success" size="sm" onClick={() => handleAgregar(prod)}>
                        Agregar →
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No hay más productos disponibles.</ListGroup.Item>
                )}
              </ListGroup>
            </Col>

            {/* Columna Destacados */}
            <Col md={6}>
              <h3>Productos Destacados (Home)</h3>
              <ListGroup className="lista-gestion">
                {destacados.length > 0 ? (
                  destacados.map(prod => (
                    <ListGroup.Item key={prod.codigo} className="item-gestion">
                      <Button variant="danger" size="sm" onClick={() => handleQuitar(prod)}>
                        ← Quitar
                      </Button>
                      <img src={prod.imagen || prod.img} alt={prod.nombre} />
                      <span>{prod.nombre}</span>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Aún no hay productos destacados.</ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GestionDestacados;