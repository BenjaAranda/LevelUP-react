// En: src/pages/DetalleProducto.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { getProductoPorCodigo } from '../data/productos.js'; 
import { useCart } from '../hooks/useCart.jsx';
import '../styles/detalle-producto.css'; 
// 1. Importa tus nuevas herramientas
import BotonVolver from '../components/BotonVolver';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const DetalleProducto = () => {
  // 2. Llama al hook del "Esc" 
  useGoBackOnEsc();
  
  const { codigo } = useParams(); 
  const { agregarAlCarrito, carritoItems } = useCart(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DetalleProducto.jsx - Cargando producto con código:", codigo);
    setLoading(true);
    setError('');
    try {
        const prod = getProductoPorCodigo(codigo);
        if (prod) {
            console.log("DetalleProducto.jsx - Producto encontrado:", prod);
            setProducto(prod);
        } else {
            console.warn("DetalleProducto.jsx - Producto no encontrado con código:", codigo);
            setError('Producto no encontrado.');
        }
    } catch(err) {
        console.error("DetalleProducto.jsx - Error al cargar producto:", err);
        setError('Error al cargar el producto.');
    } finally {
        setLoading(false);
    }
  }, [codigo, navigate]);

  // ... (lógica de stock y puedeAgregar )
  const itemEnCarrito = producto ? carritoItems.find(item => item.codigo === producto.codigo) : null;
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.unidades : 0;
  const stockDisponible = producto && typeof producto.stock === 'number' && producto.stock > 0; 
  const puedeAgregar = stockDisponible && cantidadEnCarrito < producto.stock;


  if (loading) {
      return <Container className="my-5"><Alert variant="info">Cargando datos del producto...</Alert></Container>;
  }

  // Mostramos error si existe Y el producto no se cargó
  if (error && !producto) {
     return (
       <Container className="my-5 text-center">
           <Alert variant="danger">{error}</Alert>
           {/* --- BOTÓN AÑADIDO AQUÍ --- */}
           <BotonVolver />
       </Container>
     );
  }

  // Si no hay producto después de cargar...
  if (!producto) {
     return (
       <Container className="my-5 text-center">
           <Alert variant="warning">No se pudo cargar la información del producto.</Alert>
           {/* --- BOTÓN AÑADIDO AQUÍ --- */}
           <BotonVolver />
       </Container>
     );
  }


  // Si el producto SÍ existe, lo mostramos
  return (
    <Container className="detalle-producto-container my-4">
      
      {/* --- 3. BOTÓN AÑADIDO EN EL LUGAR CORRECTO --- */}
      <BotonVolver />

      <Row>
        <Col md={6} className="detalle-imagen">
          <img src={producto.img || producto.imagen} alt={producto.nombre} className="img-fluid" />
        </Col>
        <Col md={6} className="detalle-info d-flex flex-column">
          <h1 className="detalle-titulo">{producto.nombre}</h1>
          <p className="detalle-categoria">
            Categoría: <Link to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`}>{producto.categoria}</Link>
          </p>
          <p className="detalle-precio">
            ${producto.precio.toLocaleString("es-CL")} CLP
          </p>
          <p className="stock-info mb-3"> 
             {stockDisponible ? `Stock disponible: ${producto.stock}` : <span className="text-danger fw-bold">AGOTADO</span>}
          </p>
          <div className="detalle-descripcion flex-grow-1">
            <p>{producto.descripcion || "Descripción no disponible."}</p>
          </div>
          
          <Button 
            className="btn-carrito-detalle mt-3"
            onClick={() => agregarAlCarrito(producto)}
            disabled={!puedeAgregar}
            title={!puedeAgregar ? (stockDisponible ? 'Ya tienes el máximo en tu carrito' : 'Producto Agotado') : 'Agregar al Carrito'}
          >
            {puedeAgregar ? 'Agregar al Carrito' : (stockDisponible ? 'Máx. en carrito' : 'Agotado')}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleProducto;