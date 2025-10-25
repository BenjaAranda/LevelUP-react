// En: src/pages/DetalleProducto.jsx

import React, { useState, useEffect } from 'react';
// --- ¡CORRECCIÓN! ---
// Importamos useParams junto con Link
import { useParams, Link, useNavigate } from 'react-router-dom'; 
// --- FIN CORRECCIÓN ---
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'; // Importamos Alert
import { getProductoPorCodigo } from '../data/productos.js'; 
import { useCart } from '../hooks/useCart.jsx';
// Importamos los estilos (asegúrate que exista el archivo)
import '../styles/detalle-producto.css'; 

const DetalleProducto = () => {
  // Ahora useParams está definido
  const { codigo } = useParams(); 
  const { agregarAlCarrito, carritoItems } = useCart(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirigir si hay error

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
            // Opcional: Redirigir después de un tiempo si no se encuentra
            // setTimeout(() => navigate('/productos'), 3000); 
        }
    } catch(err) {
        console.error("DetalleProducto.jsx - Error al cargar producto:", err);
        setError('Error al cargar el producto.');
    } finally {
        setLoading(false);
    }
  }, [codigo, navigate]); // Añadimos navigate a las dependencias

  // Calculamos si se puede agregar (igual que en ProductCard)
  const itemEnCarrito = producto ? carritoItems.find(item => item.codigo === producto.codigo) : null;
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.unidades : 0;
  // Aseguramos que producto.stock exista antes de comparar
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
            <Link to="/productos">
                <Button variant="secondary">Volver a Productos</Button>
            </Link>
        </Container>
     );
  }
  // Si no hay producto después de cargar (y no hubo error explícito), es raro, pero manejamos el caso
  if (!producto) {
      return (
        <Container className="my-5 text-center">
            <Alert variant="warning">No se pudo cargar la información del producto.</Alert>
             <Link to="/productos">
                <Button variant="secondary">Volver a Productos</Button>
            </Link>
        </Container>
      );
  }


  // Si el producto SÍ existe, lo mostramos
  return (
    <Container className="detalle-producto-container my-4">
      <Row>
        <Col md={6} className="detalle-imagen">
          <img src={producto.img || producto.imagen} alt={producto.nombre} className="img-fluid" />
        </Col>
        <Col md={6} className="detalle-info d-flex flex-column"> {/* Usamos flex column */}
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
          <div className="detalle-descripcion flex-grow-1"> {/* flex-grow para que ocupe espacio */}
            <p>{producto.descripcion || "Descripción no disponible."}</p>
          </div>
          
          {/* Botón condicional */}
          <Button 
            className="btn-carrito-detalle mt-3" // Quitamos mt-auto, añadimos mt-3
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