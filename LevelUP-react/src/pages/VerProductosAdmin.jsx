// En: src/pages/VerProductosAdmin.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import '../styles/verProductosAdmin.css'; // CSS Nuevo

const VerProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(''); // Para feedback

  // 1. Cargar productos de localStorage al montar
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(productosGuardados);
  }, []);

  // 2. Manejar el cambio de stock en el estado LOCAL (React)
  const handleStockChange = (codigo, nuevoStock) => {
    // Convertimos a número, asegurando que no sea negativo
    const stockNum = Math.max(0, Number(nuevoStock));
    
    setProductos(prevProductos =>
      prevProductos.map(p =>
        p.codigo === codigo ? { ...p, stock: stockNum } : p
      )
    );
  };

  // 3. Guardar el stock actualizado en LOCALSTORAGE
  const handleGuardarStock = (codigo) => {
    // Obtenemos todos los productos del localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    // Encontramos el producto que cambió en nuestro estado de React
    const productoActualizado = productos.find(p => p.codigo === codigo);

    if (!productoActualizado) return; // No debería pasar

    // Creamos la nueva lista para guardar
    const nuevaListaGuardada = productosGuardados.map(p =>
      p.codigo === codigo ? productoActualizado : p
    );

    // Guardamos en localStorage
    localStorage.setItem("productos", JSON.stringify(nuevaListaGuardada));
    
    setMensaje(`Stock de "${productoActualizado.nombre}" actualizado a ${productoActualizado.stock}.`);
    setTimeout(() => setMensaje(''), 3000); // Borra el mensaje
  };

  return (
    <Container className="my-5">
      <Card>
        <Card.Header as="h2">Gestionar Productos</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>
          
          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          
          <ListGroup>
            {productos.length === 0 ? (
              <ListGroup.Item>No hay productos para mostrar.</ListGroup.Item>
            ) : (
              productos.map(prod => (
                <ListGroup.Item key={prod.codigo} className="admin-producto-item">
                  <img src={prod.imagen} alt={prod.nombre} className="admin-producto-img" />
                  <div className="admin-producto-info">
                    <strong>{prod.nombre}</strong>
                    <small className="text-muted">{prod.codigo}</small>
                  </div>
                  <div className="admin-producto-stock">
                    <InputGroup>
                      <InputGroup.Text>Stock:</InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        value={prod.stock}
                        onChange={(e) => handleStockChange(prod.codigo, e.target.value)}
                      />
                      <Button variant="outline-success" onClick={() => handleGuardarStock(prod.codigo)}>
                        Guardar
                      </Button>
                    </InputGroup>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerProductosAdmin;