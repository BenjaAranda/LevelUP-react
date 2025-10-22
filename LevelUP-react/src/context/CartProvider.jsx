// En: src/context/CartProvider.jsx
import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

// Función para cargar el carrito desde localStorage
const cargarCarritoDesdeStorage = () => {
  const carritoGuardado = localStorage.getItem('carrito');
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
};

export const CartProvider = ({ children }) => {
  // El estado del carrito se inicializa con lo que haya en localStorage
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);

  // Efecto para guardar en localStorage CADA VEZ que el carrito cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carritoItems));
  }, [carritoItems]);

  // --- Funciones del Carrito ---

  // Agrega un producto (lógica de tu productos.js y carrito.js combinada)
  const agregarAlCarrito = (producto) => {
    setCarritoItems(prevItems => {
      // 1. Busca si el producto ya existe
      const itemExistente = prevItems.find(item => item.codigo === producto.codigo);

      if (itemExistente) {
        // 2. Si existe, actualiza la cantidad (inmutablemente)
        return prevItems.map(item =>
          item.codigo === producto.codigo
            ? { ...item, unidades: item.unidades + 1 }
            : item
        );
      } else {
        // 3. Si no existe, lo agrega al array con unidades: 1
        return [...prevItems, { ...producto, unidades: 1 }];
      }
    });
  };

  // Resta una unidad (de tu carrito.js)
  const restarDelCarrito = (codigo) => {
    setCarritoItems(prevItems => {
      const itemExistente = prevItems.find(item => item.codigo === codigo);

      if (itemExistente.unidades === 1) {
        // Si la unidad es 1, lo elimina del carrito
        return prevItems.filter(item => item.codigo !== codigo);
      } else {
        // Si es > 1, resta la unidad
        return prevItems.map(item =>
          item.codigo === codigo
            ? { ...item, unidades: item.unidades - 1 }
            : item
        );
      }
    });
  };

  // Elimina un producto (de tu carrito.js)
  const eliminarDelCarrito = (codigo) => {
    setCarritoItems(prevItems => prevItems.filter(item => item.codigo !== codigo));
  };

  // Vacía el carrito
  const vaciarCarrito = () => {
    setCarritoItems([]);
  };

  // --- Valores Derivados (para mostrar en el resumen) ---
  const totalItems = carritoItems.reduce((acc, item) => acc + item.unidades, 0);
  const totalPrecio = carritoItems.reduce((acc, item) => acc + (item.precio * item.unidades), 0);


  const value = {
    carritoItems,
    agregarAlCarrito,
    restarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPrecio
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};