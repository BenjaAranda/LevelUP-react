// En: src/pages/CrearProducto.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
// Asegúrate de importar el CSS
import '../styles/crearProducto.css'; 

const CrearProducto = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState('Poleras Personalizadas');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(0); // Inicia en 0
  const [imagen, setImagen] = useState('');
  
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validación simple
    if (!codigo || !nombre || precio <= 0 || stock < 0 || !imagen) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    if (productos.some(p => p.codigo === codigo)) {
      setError('El código de producto ya existe. Usa uno diferente.');
      return;
    }

    const nuevoProducto = {
      codigo,
      categoria,
      nombre,
      precio,
      descripcion,
      stock, 
      imagen
    };

    productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productos));

    setExito(`¡Producto "${nombre}" creado con éxito!`);
    setTimeout(() => {
      navigate('/admin/ver-productos');
    }, 2000);
  };

  return (
    <Container className="my-5">
      <Card>
        <Card.Header as="h2">Crear Nuevo Producto</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {exito && <Alert variant="success">{exito}</Alert>}

            <Form.Group className="mb-3" controlId="codigo">
              <Form.Label>Código (SKU) *</Form.Label>
              <Form.Control type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre Producto *</Form.Label>
              <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Poleras Personalizadas">Poleras Personalizadas</option>
                <option value="Juegos de Mesa">Juegos de Mesa</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Consolas">Consolas</option>
                <option value="Computadores Gamers">Computadores Gamers</option>
                <option value="Sillas Gamers">Sillas Gamers</option>
                <option value="Mouse">Mouse</option>
                <option value="Mousepad">Mousepad</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="precio">
              <Form.Label>Precio *</Form.Label>
              <Form.Control type="number" min="0" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
            </Form.Group>
            
            {/* --- CAMPO STOCK CORREGIDO --- */}
            <Form.Group className="mb-3" controlId="stock">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number" 
                min="0"     
                value={stock} 
                onChange={(e) => {
                  const inputValue = e.target.value; 
                  if (inputValue === '') {
                    setStock(0);
                    return; 
                  }
                  const newValue = parseInt(inputValue, 10);
                  if (isNaN(newValue) || newValue < 0) {
                    setStock(stock > 0 ? stock : 0);
                  } else {
                    setStock(newValue);
                  }
                }}
                onFocus={(e) => {
                  if (e.target.value === '0') {
                    e.target.select();
                  }
                }}
                className="no-spinners" // Clase CSS para ocultar botones
              />
            </Form.Group>
            {/* --- FIN CAMPO STOCK --- */}
            
            <Form.Group className="mb-3" controlId="imagen">
              <Form.Label>URL de Imagen *</Form.Label>
              <Form.Control type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="/img_productos/mi-producto.png" />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </Form.Group>

            <Button variant="success" type="submit">Crear Producto</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CrearProducto;