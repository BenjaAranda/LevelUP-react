// En: src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// Este es el componente de tarjeta de producto REUTILIZABLE
// Lo usaremos en Home.jsx y Productos.jsx
const ProductCard = ({ producto, onAgregarAlCarrito }) => {
  
  // Manejamos imágenes faltantes o con nombres distintos (img vs imagen)
  const imageUrl = producto.img || producto.imagen || '/placeholder.png';

  return (
    // Usamos 'producto' como la clase base de la tarjeta (de tu main.css)
    <div className="producto">
      
      {/* Hacemos la imagen un link al detalle del producto */}
      <Link to={`/producto/${producto.codigo}`}>
        <img src={imageUrl} alt={producto.nombre} />
      </Link>
      
      <h3>{producto.nombre}</h3>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <p className="precio">${producto.precio.toLocaleString("es-CL")} CLP</p>
      
      {/* Botón para agregar al carrito */}
      <button className="btn-carrito" onClick={() => onAgregarAlCarrito(producto)}>
        Agregar al carrito
      </button>
      
      {/* Botón para ver el detalle */}
      <Link to={`/producto/${producto.codigo}`} className="btn-detalle">
        Ver detalle
      </Link>
    </div>
  );
};

export default ProductCard;