// En: src/pages/Carrito.jsx

import React from 'react';
import { Link } from 'react-router-dom';
// 1. Importamos el hook y los estilos
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css'; 

const Carrito = () => {
  // 2. Obtenemos todo del Contexto usando los nombres correctos
  const { 
    carritoItems, 
    restarDelCarrito, 
    agregarAlCarrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    totalPrecio 
  } = useCart();

  return (
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      <div id="listaCarrito">
        {carritoItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          carritoItems.map((producto) => (
            <div key={producto.codigo} className="item-carrito">
              <h3>{producto.nombre}</h3>
              <p>
                <span className="texto-label">Unidades:</span>
                {/* 3. Usamos 'unidades' */}
                <span className="texto-valor">{producto.unidades}</span> 
                {/* 4. Conectamos los botones a las funciones */}
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
                {/* 5. Usamos 'unidades' */}
                <span className="texto-valor">${(producto.unidades * producto.precio).toLocaleString('es-CL')}</span> 
              </p>
            </div>
          ))
        )}
      </div>

      {/* Botón Vaciar Carrito */}
      {carritoItems.length > 0 && ( // Solo se muestra si hay items
        <div className="acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar Carrito</button>
        </div>
      )}

      {/* Resumen y Finalizar Compra */}
      <div className="resumen">
        <h2>
          <span className="texto-label">Total: </span>
          {/* 6. Usamos 'totalPrecio' */}
          <span className="texto-valor">$ {totalPrecio.toLocaleString('es-CL')}</span> 
        </h2>
        {/* Enlazamos al futuro checkout (por ahora, placeholder) */}
        <Link to="/checkout" className="btn-finalizar">
          Finalizar Compra
        </Link>
      </div>
    </div>
  );
};

export default Carrito;