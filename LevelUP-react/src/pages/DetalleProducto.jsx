import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import client from '../api/axiosClient'; // Conexión API
import { useCart } from '../hooks/useCart.jsx';
import '../styles/detalle-producto.css'; 
import BotonVolver from '../components/BotonVolver';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const DetalleProducto = () => {
  useGoBackOnEsc();
  
  const { codigo } = useParams(); 
  const { agregarAlCarrito, carritoItems } = useCart(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError('');
      try {
        // GET al backend: /api/v1/productos/{codigo}
        const response = await client.get(`/productos/${codigo}`);
        if (response.data) {
           setProducto(response.data);
        } else {
           setError('Producto no encontrado.');
        }
      } catch(err) {
        console.error("Error al cargar producto:", err);
        setError('Error al cargar el producto o no existe.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [codigo]);

  // Validaciones de stock
  const itemEnCarrito = producto ? carritoItems.find(item => item.codigo === producto.codigo) : null;
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.unidades : 0;
  // Backend suele mandar numero, aseguramos tipo
  const stockDisponible = producto && (producto.stock > 0); 
  const puedeAgregar = stockDisponible && cantidadEnCarrito < producto.stock;

  if (loading) {
      return <Container className="my-5"><Alert variant="info">Cargando datos del producto...</Alert></Container>;
  }

  if (error && !producto) {
     return (
       <Container className="my-5 text-center">
           <Alert variant="danger">{error}</Alert>
           <BotonVolver />
       </Container>
     );
  }

  if (!producto) {
     return (
       <Container className="my-5 text-center">
           <Alert variant="warning">No se pudo cargar la información del producto.</Alert>
           <BotonVolver />
       </Container>
     );
  }

  return (
    <Container className="detalle-producto-container my-4">
      <BotonVolver />

      <Row>
        <Col md={6} className="detalle-imagen">
          {/* Fallback de imagen si viene nula */}
          <img src={producto.img || producto.imagen || '/placeholder.png'} alt={producto.nombre} className="img-fluid" />
        </Col>
        <Col md={6} className="detalle-info d-flex flex-column">
          <h1 className="detalle-titulo">{producto.nombre}</h1>
          <p className="detalle-categoria">
            Categoría: <Link to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`}>{producto.categoria}</Link>
          </p>
          <p className="detalle-precio">
            ${(producto.precio || 0).toLocaleString("es-CL")} CLP
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