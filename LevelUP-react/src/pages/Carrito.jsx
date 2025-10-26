// En: src/pages/Carrito.jsx (Con Safeguard)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  // 1. OBTENEMOS EL CONTEXTO COMPLETO PRIMERO
  const cartContext = useCart();
  console.log("Carrito.jsx - Contexto recibido:", cartContext);

  // 2. EXTRAEMOS VALORES CON SAFEGUARDS (valor por defecto: array vacío o 0)
  const carritoItems = cartContext?.carritoItems || [];
  const totalPrecio = cartContext?.totalPrecio || 0;
  // Extraemos las funciones (asumiendo que siempre estarán si el contexto existe)
  const {
    restarDelCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    finalizarCompraYActualizarStock
  } = cartContext || {}; // Objeto vacío si el contexto es undefined

  console.log("Carrito.jsx - carritoItems a usar:", carritoItems);

  const handleFinalizarCompra = async () => {
      // Asegurarse de que la función exista antes de llamarla
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
        {/* 3. AHORA .length ES SEGURO PORQUE carritoItems ES UN ARRAY */}
        {carritoItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          // 4. AHORA .map() ES SEGURO
          carritoItems.map((producto) => (
            // Verificamos que 'producto' sea válido antes de renderizar el item
            (producto && producto.codigo) ? (
              <div key={producto.codigo} className="item-carrito">
                <h3>{producto.nombre || 'Nombre no disponible'}</h3>
                <p>
                  <span className="texto-label">Unidades:</span>
                  <span className="texto-valor">{producto.unidades || 0}</span>
                  {/* Asegurarse que las funciones existan antes de llamar */}
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
            ) : null // No renderizar si el item del carrito es inválido
          ))
        )}
      </div>

      {/* Botón Vaciar Carrito (solo si hay items y la función existe) */}
      {carritoItems.length > 0 && vaciarCarrito && (
        <div className="acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar Carrito</button>
        </div>
      )}

      {/* Resumen y Finalizar Compra */}
      <div className="resumen">
        <h2>
          <span className="texto-label">Total: </span>
          {/* Usamos totalPrecio con fallback 0 */}
          <span className="texto-valor">$ {totalPrecio.toLocaleString('es-CL')}</span>
        </h2>
        {/* Botón deshabilitado si no hay items o la función no existe */}
        <button
            className="btn-finalizar"
            onClick={handleFinalizarCompra}
            disabled={carritoItems.length === 0 || !finalizarCompraYActualizarStock}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Carrito;