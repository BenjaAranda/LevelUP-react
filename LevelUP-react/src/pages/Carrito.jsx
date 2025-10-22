// En: src/pages/Carrito.jsx

import React from 'react';
import { Link } from 'react-router-dom';
// --- 1. Importamos el hook del carrito ---
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css'; 

const Carrito = () => {
  // --- 2. Obtenemos todo del Contexto ---
  const { 
    carritoItems, 
    restarDelCarrito, 
    agregarAlCarrito, // Para el botón ➕
    eliminarDelCarrito, 
    vaciarCarrito, 
    totalPrecio 
  } = useCart();

  return (
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      <div id="listaCarrito">
        {/* --- 3. Renderizamos desde el Contexto --- */}
        {carritoItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          carritoItems.map((producto) => (
            <div key={producto.codigo} className="item-carrito">
              <h3>{producto.nombre}</h3>
              <p>
                <span className="texto-label">Unidades:</span>
                <span className="texto-valor">{producto.unidades}</span>
                {/* --- 4. Conectamos los botones a las funciones del Contexto --- */}
                <button className="btn-carrito accion" onClick={() => agregarAlCarrito(producto)}>➕</button>
                <button className="btn-carrito accion" onClick={() => restarDelCarrito(producto.codigo)}>➖</button>
                <button className="btn-carrito eliminar" onClick={() => eliminarDelCarrito(producto.codigo)}>🗑️</button>
              </p>
              <p>
                <span className="texto-label">Precio Unitario:</span>
                <span className="texto-valor">${producto.precio.toLocaleString('es-CL')}</span>
              </p>
              <p>
                <span className="texto-label">Subtotal:</span>
                <span className="texto-valor">${(producto.unidades * producto.precio).toLocaleString('es-CL')}</span>
              </p>
            </div>
          ))
        )}
      </div>

      <div className="acciones">
        <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar Carrito</button>
      </div>

      <div className="resumen">
        <h2>
          <span className="texto-label">Total: </span>
          {/* --- 5. Total desde el Contexto --- */}
          <span className="texto-valor">$ {totalPrecio.toLocaleString('es-CL')}</span>
        </h2>
        <button className="btn-finalizar">Finalizar Compra</button>
      </div>
    </div>
  );
};

export default Carrito;