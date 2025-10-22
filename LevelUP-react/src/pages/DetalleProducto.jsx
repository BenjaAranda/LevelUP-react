// En: src/pages/DetalleProducto.jsx

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productos as todosLosProductos } from '../data/productos.js';
import { useCart } from '../hooks/useCart.jsx';
import '../styles/productos.css'; // Reutilizamos los estilos

// (Modal simple para feedback, idéntico al de Productos.jsx)
const ModalFeedback = ({ producto, show, onHide }) => {
  if (!show) return null;
  return (
    <div className="modal-carrito-feedback" onClick={onHide}>
      <div className="modal-contenido">
        <h2>Producto agregado</h2>
        <p>Se ha agregado <span>{producto.nombre}</span> al carrito 🛒</p>
        <button onClick={onHide}>Cerrar</button>
      </div>
    </div>
  );
};


const DetalleProducto = () => {
  // --- Hooks y Contexto ---
  const { codigo } = useParams(); // Hook para leer el param :codigo de la URL
  const { agregarAlCarrito } = useCart();
  
  // --- Lógica de búsqueda (de tu detalle-producto.html) ---
  const producto = todosLosProductos.find(p => p.codigo === codigo);

  // --- Estado para el modal ---
  const [modalShow, setModalShow] = useState(false);

  const handleAgregarCarrito = (producto) => {
    agregarAlCarrito(producto);
    setModalShow(true);
  };

  // --- Renderizado ---
  if (!producto) {
    return (
      <div className="detalle-producto">
        <p className="muted">Producto no encontrado.</p>
        <Link to="/productos" className="btn-detalle">Volver a productos</Link>
      </div>
    );
  }

  return (
    <>
      <ModalFeedback producto={producto} show={modalShow} onHide={() => setModalShow(false)} />
      
      {/* Reemplaza <main id="detalleProducto"> */}
      <main className="detalle-producto">
        <div className="producto-detalle-card">
          <img src={producto.imagen} alt={producto.nombre} />
          <div>
            <h2>{producto.nombre}</h2>
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <p>{producto.descripcion}</p>
            <p><strong>Stock disponible:</strong> {producto.stock}</p>
            <p className="precio">${producto.precio.toLocaleString("es-CL")} CLP</p>
            <button className="btn-carrito" onClick={() => handleAgregarCarrito(producto)}>
              🛒 Agregar al carrito
            </button>
            <Link to="/productos" className="btn-detalle" style={{marginLeft: '10px'}}>
              Volver a productos
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default DetalleProducto;