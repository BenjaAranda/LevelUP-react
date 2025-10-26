// En: src/components/ProductCard.jsx (Con Safeguard)

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx'; 

const ProductCard = ({ producto, onAgregarAlCarrito }) => {
  // 1. OBTENEMOS EL CONTEXTO COMPLETO PRIMERO (PARA DEBUG)
  const cartContext = useCart(); 
  console.log("ProductCard - Contexto Recibido:", cartContext); // Log para ver qué llega

  // 2. EXTRAEMOS carritoItems CON UN VALOR POR DEFECTO (ARRAY VACÍO)
  const carritoItems = cartContext?.carritoItems || []; 
  console.log("ProductCard - carritoItems a usar:", carritoItems); // Log para ver el array

  // Verificamos si los datos esenciales del producto existen
  if (!producto || !producto.codigo || !producto.nombre || producto.precio === undefined || producto.stock === undefined) {
     console.error("ProductCard.jsx - Datos incompletos para:", producto);
     return <div className="producto" style={{borderColor: 'red', color: 'red', textAlign:'center'}}>Datos<br/>Inválidos</div>;
  }
  
  const imageUrl = producto.img || producto.imagen || '/placeholder.png'; 
  const stockDisponible = producto.stock > 0;

  // 3. AHORA .find() ES SEGURO PORQUE carritoItems ES UN ARRAY
  const itemEnCarrito = carritoItems.find(item => item.codigo === producto.codigo); 
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.unidades : 0;
  const puedeAgregar = stockDisponible && cantidadEnCarrito < producto.stock;

  return (
    <div className={`producto ${!stockDisponible ? 'agotado' : ''}`}> 
      <Link to={`/producto/${producto.codigo}`}>
        <img src={imageUrl} alt={producto.nombre} />
      </Link>
      
      <h3>{producto.nombre}</h3>
      <p><strong>Categoría:</strong> {producto.categoria || 'N/A'}</p> 
      <p className="precio">${producto.precio.toLocaleString("es-CL")} CLP</p>
      
      <p className="stock-info">
        {stockDisponible ? `Stock: ${producto.stock}` : <span className="text-danger fw-bold">AGOTADO</span>}
      </p>

      <button 
        className="btn-carrito" 
        onClick={() => onAgregarAlCarrito(producto)}
        disabled={!puedeAgregar} 
        title={!puedeAgregar ? (stockDisponible ? 'Ya tienes el máximo en tu carrito' : 'Producto Agotado') : 'Agregar al carrito'}
      >
        {puedeAgregar ? 'Agregar al carrito' : (stockDisponible ? 'Máx. en carrito' : 'Agotado')}
      </button>
      
      <Link to={`/producto/${producto.codigo}`} className="btn-detalle">
        Ver detalle
      </Link>
    </div>
  );
};

export default ProductCard;