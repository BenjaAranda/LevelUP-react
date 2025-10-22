// En: src/pages/Carrito.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Para el botón de "Finalizar Compra"
import '../styles/carrito.css'; // Asegúrate de crear este archivo

// --- Datos de ejemplo (de tu carrito.js) ---
// En un futuro, esto vendrá de un "Contexto" global, no estará aquí.
const mockCarrito = [
  { codigo: "JM001", categoria: "Juegos de Mesa", nombre: "Catan", precioUnitario: 29990, unidades: 1 },
  { codigo: "JM002", categoria: "Juegos de Mesa", nombre: "Carcassonne", precioUnitario: 24990, unidades: 1 },
  { codigo: "AC001", categoria: "Accesorios", nombre: "Controlador Xbox Series X", precioUnitario: 59990, unidades: 1 },
];
// --- Fin de datos de ejemplo ---

const Carrito = () => {
  // --- Estado para manejar los items del carrito ---
  const [carritoItems, setCarritoItems] = useState(mockCarrito);

  // --- Funciones para manipular el carrito (reemplazan tu JS) ---

  // Cambiar unidades (➕ o ➖)
  const handleChangeUnidades = (index, cambio) => {
    // Creamos una copia del array para no mutar el estado
    const nuevosItems = [...carritoItems];
    const item = nuevosItems[index];

    if (item.unidades + cambio > 0) {
      // Creamos una copia del *objeto* para inmutabilidad
      nuevosItems[index] = { ...item, unidades: item.unidades + cambio };
      setCarritoItems(nuevosItems);
    } else {
      // Si la unidad es 0, eliminamos el producto (como en tu lógica)
      handleEliminarProducto(index);
    }
  };

  // Eliminar producto con 🗑️
  const handleEliminarProducto = (index) => {
    // filter() crea un nuevo array (inmutable)
    const nuevosItems = carritoItems.filter((_, i) => i !== index);
    setCarritoItems(nuevosItems);
  };

  // Vaciar carrito
  const handleVaciarCarrito = () => {
    setCarritoItems([]);
  };

  // --- Cálculo del Total (Estado Derivado) ---
  // Se calcula en cada renderizado basado en el estado
  const total = carritoItems.reduce((acc, prod) => acc + (prod.unidades * prod.precioUnitario), 0);

  return (
    // Reemplazamos <main> por <div>
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      {/* --- Lista de productos (reemplaza <div id="listaCarrito">) --- */}
      <div id="listaCarrito">
        {carritoItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          carritoItems.map((producto, index) => (
            <div key={producto.codigo || index} className="item-carrito">
              <h3>{producto.nombre}</h3>
              <p>
                <span className="texto-label">Unidades:</span>
                <span className="texto-valor">{producto.unidades}</span>
                {/* Usamos onClick de React */}
                <button className="btn-carrito accion" onClick={() => handleChangeUnidades(index, 1)}>➕</button>
                <button className="btn-carrito accion" onClick={() => handleChangeUnidades(index, -1)}>➖</button>
                <button className="btn-carrito eliminar" onClick={() => handleEliminarProducto(index)}>🗑️</button>
              </p>
              <p>
                <span className="texto-label">Precio Unitario:</span>
                <span className="texto-valor">${producto.precioUnitario.toLocaleString('es-CL')}</span>
              </p>
              <p>
                <span className="texto-label">Subtotal:</span>
                <span className="texto-valor">${(producto.unidades * producto.precioUnitario).toLocaleString('es-CL')}</span>
              </p>
            </div>
          ))
        )}
      </div>

      {/* --- Acciones del carrito --- */}
      <div className="acciones">
        <button className="btn-vaciar" onClick={handleVaciarCarrito}>Vaciar Carrito</button>
      </div>

      {/* --- Resumen de compra --- */}
      <div className="resumen">
        <h2>
          {/* El total se renderiza desde la variable 'total' */}
          <span className="texto-label">Total: </span>
          <span className="texto-valor">$ {total.toLocaleString('es-CL')}</span>
        </h2>
        <button className="btn-finalizar">Finalizar Compra</button>
      </div>
    </div>
  );
};

export default Carrito;