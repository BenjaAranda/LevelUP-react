// En: src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart'; // Importamos useCart para chequear stock

const ProductCard = ({ producto, onAgregarAlCarrito }) => {
  const { cart } = useCart(); // Obtenemos carrito para comparar stock vs cantidad en carrito

  // Verificamos si los datos esenciales existen
  if (!producto || !producto.codigo || !producto.nombre || producto.precio === undefined || producto.stock === undefined) {
     console.error("ProductCard.jsx - Datos incompletos para:", producto);
     return <div className="producto" style={{borderColor: 'red', color: 'red', textAlign:'center'}}>Datos<br/>Inválidos</div>;
  }
  
  const imageUrl = producto.img || producto.imagen || '/placeholder.png'; 
  const stockDisponible = producto.stock > 0;

  // Calculamos cuántas unidades de este producto ya están en el carrito
  const itemEnCarrito = cart.find(item => item.codigo === producto.codigo);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  // Podemos agregar si el stock es > 0 Y la cantidad en carrito es menor al stock
  const puedeAgregar = stockDisponible && cantidadEnCarrito < producto.stock;

  return (
    <div className={`producto ${!stockDisponible ? 'agotado' : ''}`}> {/* Añade clase si está agotado */}
      <Link to={`/producto/${producto.codigo}`}>
        <img src={imageUrl} alt={producto.nombre} />
      </Link>
      
      <h3>{producto.nombre}</h3>
      <p><strong>Categoría:</strong> {producto.categoria || 'N/A'}</p> 
      <p className="precio">${producto.precio.toLocaleString("es-CL")} CLP</p>
      
      {/* Mostramos stock (opcional) */}
      <p className="stock-info">
        {stockDisponible ? `Stock: ${producto.stock}` : <span className="text-danger fw-bold">AGOTADO</span>}
      </p>

      {/* Botón condicional */}
      <button 
        className="btn-carrito" 
        onClick={() => onAgregarAlCarrito(producto)}
        // Deshabilitado si no se puede agregar
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