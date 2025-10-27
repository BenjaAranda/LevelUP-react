// En: src/pages/CrearProducto.jsx

import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
// 1. IMPORTAMOS obtenerCategoriasUnicas
import { agregarProducto, obtenerCategoriasUnicas } from '../data/productos.js'; 
import '../styles/crearProducto.css'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const CrearProducto = () => {
  const navigate = useNavigate();
  useGoBackOnEsc();
  
  // Estados existentes...
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState(''); // Inicia vacío
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(0); 
  const [imagen, setImagen] = useState('');
  
  // 2. NUEVO ESTADO para las categorías del <select>
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // 3. useEffect para cargar categorías al montar
  useEffect(() => {
    const cats = obtenerCategoriasUnicas();
    setCategoriasDisponibles(cats);
    // Selecciona la primera categoría por defecto si existe
    if (cats.length > 0) {
      setCategoria(cats[0]);
    }
  }, []); // Se ejecuta solo una vez

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // 4. Asegurarse que se seleccionó una categoría válida
    if (!codigo || !nombre || !categoria || precio <= 0 || stock < 0 || !imagen) {
      setError('Por favor, completa todos los campos obligatorios, incluyendo la categoría.');
      return;
    }

    const nuevoProducto = { codigo, categoria, nombre, precio, descripcion, stock, imagen };

    try {
      agregarProducto(nuevoProducto); // Usamos la función CRUD
      setExito(`¡Producto "${nombre}" creado con éxito!`);
      setTimeout(() => {
        navigate('/admin/ver-productos');
      }, 2000);
    } catch (err) {
       setError(err.message || 'Error al crear el producto.');
    }
  };

  return (
    <Container className="crear-producto-container my-5"> 
      <Card>
        <Card.Header as="h2">Crear Nuevo Producto</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {exito && <Alert variant="success">{exito}</Alert>}

            {/* Código, Nombre (sin cambios) */}
             <Form.Group className="mb-3" controlId="codigo">
               <Form.Label>Código (SKU) *</Form.Label>
               <Form.Control type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
             </Form.Group>
             <Form.Group className="mb-3" controlId="nombre">
               <Form.Label>Nombre Producto *</Form.Label>
               <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
             </Form.Group>
            
            {/* --- CATEGORÍA DINÁMICA --- */}
            <Form.Group className="mb-3" controlId="categoria">
              <Form.Label>Categoría *</Form.Label>
              <Form.Select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                required // Hacemos categoría obligatoria
              >
                {/* Opción deshabilitada si no hay categorías */}
                {categoriasDisponibles.length === 0 && <option value="" disabled>Cargando...</option>}
                {/* Mapeamos las categorías disponibles */}
                {categoriasDisponibles.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* --- FIN CATEGORÍA --- */}

            {/* Precio, Stock, Imagen, Descripción (sin cambios) */}
             <Form.Group className="mb-3" controlId="precio">
               <Form.Label>Precio *</Form.Label>
               <Form.Control type="number" min="0" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required />
             </Form.Group>
             <Form.Group className="mb-3" controlId="stock">
               <Form.Label>Stock *</Form.Label>
               <Form.Control type="number" min="0" value={stock} onChange={(e) => setStock(Math.max(0, Number(e.target.value)))} className="no-spinners" required />
             </Form.Group>
             <Form.Group className="mb-3" controlId="imagen">
               <Form.Label>URL de Imagen *</Form.Label>
               <Form.Control type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="/ruta/a/imagen.png" required />
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