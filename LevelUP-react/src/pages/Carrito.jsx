// En: src/pages/Carrito.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css'; 

const Carrito = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const { 
    carritoItems, 
    restarDelCarrito, 
    agregarAlCarrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    totalPrecio,
    finalizarCompraYActualizarStock // <-- Traemos la nueva función
  } = useCart();

  // --- Manejador para el botón Finalizar Compra ---
  const handleFinalizarCompra = async () => {
      const exito = await finalizarCompraYActualizarStock(); // Llama a la función del contexto
      if (exito) {
          alert("¡Compra realizada con éxito! El stock ha sido actualizado.");
          // Opcional: Redirigir a una página de agradecimiento o a Home
          navigate('/'); 
      } 
      // Si no fue exitoso, la función finalizarCompra... ya mostró una alerta
  };

  return (
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      <div id="listaCarrito">
        {carritoItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          carritoItems.map((producto) => (
            // ... (renderizado de items sin cambios) ...
             <div key={producto.codigo} className="item-carrito">
              <h3>{producto.nombre}</h3>
              <p>
                <span className="texto-label">Unidades:</span>
                <span className="texto-valor">{producto.unidades}</span> 
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

      {carritoItems.length > 0 && (
        <div className="acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar Carrito</button>
        </div>
      )}

      <div className="resumen">
        <h2>
          <span className="texto-label">Total: </span>
          <span className="texto-valor">$ {totalPrecio.toLocaleString('es-CL')}</span> 
        </h2>
        {/* El botón ahora llama a handleFinalizarCompra */}
        {/* Deshabilitado si el carrito está vacío */}
        <button 
            className="btn-finalizar" 
            onClick={handleFinalizarCompra}
            disabled={carritoItems.length === 0} 
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Carrito;