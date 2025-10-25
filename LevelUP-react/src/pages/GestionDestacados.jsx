// En: src/pages/GestionDestacados.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Alert, Row, Col } from 'react-bootstrap';
import '../styles/gestionDestacados.css'; // CSS Nuevo

const GestionDestacados = () => {
  // Estado para todos los productos
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  // Estado para los productos que SÍ están destacados
  const [destacados, setDestacados] = useState([]);
  
  const [mensaje, setMensaje] = useState('');

  // 1. Cargar AMBAS listas desde localStorage al montar
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const destacadosGuardados = JSON.parse(localStorage.getItem("destacados")) || [];
    
    setTodosLosProductos(productosGuardados);
    setDestacados(destacadosGuardados);
  }, []);

  // 2. Función para agregar un producto a la lista de destacados
  const handleAgregar = (producto) => {
    // Evita duplicados
    if (destacados.some(p => p.codigo === producto.codigo)) return;
    
    const nuevosDestacados = [...destacados, producto];
    setDestacados(nuevosDestacados);
    
    // Guardar en localStorage
    localStorage.setItem("destacados", JSON.stringify(nuevosDestacados));
    setMensaje(`"${producto.nombre}" agregado a destacados.`);
  };

  // 3. Función para quitar un producto de la lista de destacados
  const handleQuitar = (producto) => {
    const nuevosDestacados = destacados.filter(p => p.codigo !== producto.codigo);
    setDestacados(nuevosDestacados);
    
    // Guardar en localStorage
    localStorage.setItem("destacados", JSON.stringify(nuevosDestacados));
    setMensaje(`"${producto.nombre}" quitado de destacados.`);
  };

  // 4. Lógica para saber qué productos NO están destacados
  const productosDisponibles = todosLosProductos.filter(
    p => !destacados.some(d => d.codigo === p.codigo)
  );

  return (
    <Container className="my-5">
      <Card>
        <Card.Header as="h2">Gestionar Productos Destacados</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>
          {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}

          <Row>
            {/* Columna de Productos Disponibles */}
            <Col md={6}>
              <h3>Productos Disponibles</h3>
              <ListGroup className="lista-gestion">
                {productosDisponibles.length > 0 ? (
                  productosDisponibles.map(prod => (
                    <ListGroup.Item key={prod.codigo} className="item-gestion">
                      <img src={prod.imagen} alt={prod.nombre} />
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

            {/* Columna de Productos Destacados */}
            <Col md={6}>
              <h3>Productos Destacados (Home)</h3>
              <ListGroup className="lista-gestion">
                {destacados.length > 0 ? (
                  destacados.map(prod => (
                    <ListGroup.Item key={prod.codigo} className="item-gestion">
                      <Button variant="danger" size="sm" onClick={() => handleQuitar(prod)}>
                        ← Quitar
                      </Button>
                      <img src={prod.imagen} alt={prod.nombre} />
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