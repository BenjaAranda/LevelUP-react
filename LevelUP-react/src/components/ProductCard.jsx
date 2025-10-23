// En: src/components/ProductCard.jsx
import React from 'react';

// Este componente recibe el 'producto' y la 'funcion' como props
const ProductCard = ({ producto, onAgregarAlCarrito }) => {
  return (
    <div className="producto">
      <img src={producto.img} alt={producto.nombre} />
      <h3 className="nombre">{producto.nombre}</h3>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <p className="precio">${producto.precio.toLocaleString('es-CL')} CLP</p>
      <button 
        className="btn-carrito" 
        onClick={() => onAgregarAlCarrito(producto)} // Llama a la función
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;