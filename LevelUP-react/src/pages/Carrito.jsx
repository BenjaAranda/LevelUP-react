// En: src/pages/Carrito.jsx (Botón Corregido)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const cartContext = useCart();
  // console.log("Carrito.jsx - Contexto recibido:", cartContext);

  const carritoItems = cartContext?.carritoItems || [];
  const totalPrecio = cartContext?.totalPrecio || 0;
  const {
    restarDelCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    finalizarCompraYActualizarStock
  } = cartContext || {};

  const handleFinalizarCompra = async () => {
      if (finalizarCompraYActualizarStock) {
          const exito = await finalizarCompraYActualizarStock();
          if (exito) {
              alert("¡Compra realizada con éxito! El stock ha sido actualizado.");
              navigate('/');
          }
      } else {
          console.error("Error: finalizarCompraYActualizarStock no está disponible en el contexto.");
          alert("Error al procesar la finalización de la compra.");
      }
  };

  return (
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      <div id="listaCarrito">
        {carritoItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          carritoItems.map((producto) => (
            (producto && producto.codigo) ? (
              <div key={producto.codigo} className="item-carrito">
                <h3>{producto.nombre || 'Nombre no disponible'}</h3>
                <p>
                  <span className="texto-label">Unidades:</span>
                  <span className="texto-valor">{producto.unidades || 0}</span>
                  {agregarAlCarrito && <button className="btn-carrito accion" onClick={() => agregarAlCarrito(producto)}>➕</button>}
                  {restarDelCarrito && <button className="btn-carrito accion" onClick={() => restarDelCarrito(producto.codigo)}>➖</button>}
                  {eliminarDelCarrito && <button className="btn-carrito eliminar" onClick={() => eliminarDelCarrito(producto.codigo)}>🗑️</button>}
                </p>
                <p>
                  <span className="texto-label">Precio Unitario:</span>
                  <span className="texto-valor">${(producto.precio || 0).toLocaleString('es-CL')}</span>
                </p>
                <p>
                  <span className="texto-label">Subtotal:</span>
                  <span className="texto-valor">${((producto.unidades || 0) * (producto.precio || 0)).toLocaleString('es-CL')}</span>
                </p>
              </div>
            ) : null 
          ))
        )}
      </div>

      {carritoItems.length > 0 && vaciarCarrito && (
        <div className="acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar Carrito</button>
        </div>
      )}

      <div className="resumen">
        <h2>
          <span className="texto-label">Total: </span>
          <span className="texto-valor">$ {totalPrecio.toLocaleString('es-CL')}</span>
        </h2>
        
        {/* --- CORRECCIÓN --- */}
        {/* El botón solo se deshabilita si el carrito está vacío */}
        <button
            className="btn-finalizar"
            onClick={handleFinalizarCompra}
            disabled={carritoItems.length === 0} 
        >
          Finalizar Compra
        </button>
        {/* --- FIN CORRECCIÓN --- */}

      </div>
    </div>
  );
};

export default Carrito;