// En: src/pages/DetalleProducto.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { productos } from '../data/productos.js';
import { useCart } from '../hooks/useCart.jsx';
import '../styles/detalle-producto.css'; // Crearemos este CSS

const DetalleProducto = () => {
  // 1. Obtener el 'codigo' del producto desde la URL
  const { codigo } = useParams();
  
  // 2. Traer la función de agregar al carrito
  const { agregarAlCarrito } = useCart();
  
  // 3. Buscar el producto en nuestra "base de datos"
  const producto = productos.find(p => p.codigo === codigo);

  // 4. Manejar el caso de que el producto no exista
  if (!producto) {
    return (
      <Container className="text-center text-white py-5">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o fue removido.</p>
        <Link to="/productos" className="btn btn-primary">Volver a la tienda</Link>
      </Container>
    );
  }

  // Si el producto SÍ existe, lo mostramos
  return (
    <Container className="detalle-producto-container my-4">
      <Row>
        {/* Columna de la Imagen */}
        <Col md={6} className="detalle-imagen">
          <img src={producto.img || producto.imagen} alt={producto.nombre} className="img-fluid" />
        </Col>
        
        {/* Columna de la Información */}
        <Col md={6} className="detalle-info">
          <h1 className="detalle-titulo">{producto.nombre}</h1>
          <p className="detalle-categoria">
            Categoría: <Link to={`/productos?categoria=${producto.categoria}`}>{producto.categoria}</Link>
          </p>
          <p className="detalle-precio">
            ${producto.precio.toLocaleString("es-CL")} CLP
          </p>
          
          <div className="detalle-descripcion">
            {/* Usamos 'descripcion' si existe en la BD, o un texto genérico */}
            <p>{producto.descripcion || "Descripción no disponible para este producto."}</p>
          </div>
          
          <Button 
            className="btn-carrito-detalle" 
            onClick={() => agregarAlCarrito(producto)}
          >
            Agregar al Carrito
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleProducto; 