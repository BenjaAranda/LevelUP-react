// En: src/pages/Carrito.jsx (Actualizado)

import React from 'react';
import { Link } from 'react-router-dom'; // No necesitamos useNavigate aquí
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css'; 
// Importamos Button para estilizar el Link
import { Button } from 'react-bootstrap'; 

const Carrito = () => {
  const cartContext = useCart();
  const carritoItems = cartContext?.carritoItems || [];
  const totalPrecio = cartContext?.totalPrecio || 0;
  const {
    restarDelCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
  } = cartContext || {};

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
        
        {/* --- CAMBIO: Botón es un Link a /checkout --- */}
        <Button
          as={Link} // Renderiza como un Link de React Router
          to="/checkout" // Destino
          className="btn-finalizar" // Clase CSS existente
          // Deshabilitamos el Link (visualmente) si el carrito está vacío
          disabled={carritoItems.length === 0} 
          style={carritoItems.length === 0 ? { pointerEvents: 'none' } : {}} // Previene clic si está deshabilitado
        >
          Finalizar Compra
        </Button>
        {/* --- FIN CAMBIO --- */}

      </div>
    </div>
  );
};

export default Carrito;