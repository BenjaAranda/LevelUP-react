import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 

const ProductCard = ({ producto, onAgregarAlCarrito }) => {
  // Protección contra nulos
  if (!producto) return null;

  const nombreCategoria = producto.categoria?.nombre || producto.categoria || 'Sin Categoría';
  const imagenSrc = producto.img || producto.imagen || 'https://placehold.co/400x300?text=Sin+Imagen';

  return (
    // Agregamos 'bg-dark' y 'text-white' para base oscura, pero nuestro CSS lo refinará
    <div className="card h-100 product-card-gamer bg-dark text-white border-0">
      {/* Imagen con enlace */}
      <Link to={`/producto/${producto.codigo}`} className="img-container">
        <img 
          src={imagenSrc} 
          className="card-img-top p-3" 
          alt={producto.nombre} 
        />
      </Link>

      <div className="card-body d-flex flex-column">
        {/* Categoría */}
        <div className="mb-2">
            {/* Badge oscuro con borde neón */}
            <span className="badge bg-black text-light border border-secondary">{nombreCategoria}</span>
        </div>

        {/* Título */}
        <h5 className="card-title text-truncate">
            <Link to={`/producto/${producto.codigo}`} className="text-decoration-none text-white fw-bold link-hover-effect">
                {producto.nombre}
            </Link>
        </h5>

        {/* Precio */}
        <p className="card-text fw-bold fs-4 text-info mt-auto neon-text">
          ${(producto.precio || 0).toLocaleString('es-CL')}
        </p>

        {/* Botón Agregar */}
        <div className="d-grid mt-3">
            <Button 
                className="btn-gamer" // Usamos nuestra clase personalizada
                onClick={() => onAgregarAlCarrito(producto)}
                disabled={producto.stock <= 0}
            >
                {producto.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;