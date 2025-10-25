// En: src/pages/EditarProducto.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
// Importamos las funciones CRUD y categorías
import { getProductoPorCodigo, actualizarProducto, obtenerCategoriasUnicas } from '../data/productos.js';
// Reutilizamos los estilos de CrearProducto
import '../styles/crearProducto.css'; 

const EditarProducto = () => {
  const { codigo } = useParams(); // Obtenemos el código de la URL
  const navigate = useNavigate();

  // Estados del formulario
  const [producto, setProducto] = useState(null); // Guardará el producto a editar
  const [categoria, setCategoria] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(0);
  const [imagen, setImagen] = useState('');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]); // Para el select

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Cargar datos del producto y categorías al inicio
  useEffect(() => {
    const productoAEditar = getProductoPorCodigo(codigo);
    const categorias = obtenerCategoriasUnicas();
    setCategoriasDisponibles(categorias);

    if (productoAEditar) {
      setProducto(productoAEditar);
      // Rellenamos el formulario con los datos existentes
      setCategoria(productoAEditar.categoria || '');
      setNombre(productoAEditar.nombre || '');
      setPrecio(productoAEditar.precio || 0);
      setDescripcion(productoAEditar.descripcion || '');
      setStock(productoAEditar.stock || 0);
      setImagen(productoAEditar.imagen || '');
    } else {
      setError('Producto no encontrado.');
      // Opcional: Redirigir si no se encuentra el producto
      // setTimeout(() => navigate('/admin/ver-productos'), 2000);
    }
  }, [codigo, navigate]); // Depende del código del producto

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validación simple
    if (!nombre || precio <= 0 || stock < 0 || !imagen) {
      setError('Por favor, completa nombre, precio, stock e imagen.');
      return;
    }

    // Creamos el objeto producto actualizado
    const productoActualizado = {
      ...producto, // Mantenemos el código original y otras props si las hubiera
      categoria,
      nombre,
      precio,
      descripcion,
      stock,
      imagen
    };

    try {
      actualizarProducto(productoActualizado); // Usamos la función CRUD
      setExito(`¡Producto "${nombre}" actualizado con éxito!`);
      setTimeout(() => {
        navigate('/admin/ver-productos'); // Volvemos a la lista
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el producto.');
    }
  };

  // Si el producto no se ha cargado todavía o no se encontró
  if (!producto && !error) {
    return <Container className="my-5"><Alert variant="info">Cargando datos del producto...</Alert></Container>;
  }
  if (error && !producto) {
     return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
  }


  return (
    // Reutilizamos el contenedor y estilos de CrearProducto
    <Container className="crear-producto-container my-5"> 
      <Card>
        <Card.Header as="h2">Editar Producto: {producto?.nombre || codigo}</Card.Header>
        <Card.Body>
          {/* Botón Volver */}
           <Link to="/admin/ver-productos">
               <Button variant="outline-secondary" className="mb-3">← Volver a la Lista</Button>
           </Link>
           
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {exito && <Alert variant="success">{exito}</Alert>}

            {/* Código (no editable) */}
            <Form.Group className="mb-3" controlId="codigo">
              <Form.Label>Código (SKU)</Form.Label>
              {/* Usamos readOnly para que no se pueda cambiar */}
              <Form.Control type="text" value={codigo} readOnly disabled />
            </Form.Group>

            {/* Nombre */}
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre Producto *</Form.Label>
              <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
            </Form.Group>
            
            {/* Categoría (Dinámica) */}
            <Form.Group className="mb-3" controlId="categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {/* Opción por defecto o si la categoría original ya no existe */}
                {!categoriasDisponibles.includes(categoria) && <option value={categoria}>{categoria} (Actual)</option>}
                {/* Mapeamos las categorías disponibles */}
                {categoriasDisponibles.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Precio */}
            <Form.Group className="mb-3" controlId="precio">
              <Form.Label>Precio *</Form.Label>
              <Form.Control type="number" min="0" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required/>
            </Form.Group>
            
            {/* Stock */}
            <Form.Group className="mb-3" controlId="stock">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number" 
                min="0"    
                value={stock} 
                onChange={(e) => setStock(Math.max(0, Number(e.target.value)))} // Simplificado
                className="no-spinners" 
                required
              />
            </Form.Group>
            
            {/* Imagen */}
            <Form.Group className="mb-3" controlId="imagen">
              <Form.Label>URL de Imagen *</Form.Label>
              <Form.Control type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="/ruta/a/imagen.png" required/>
            </Form.Group>
            
            {/* Descripción */}
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </Form.Group>

            <Button variant="success" type="submit">Guardar Cambios</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditarProducto;