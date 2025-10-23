// En: src/hooks/useCart.jsx

import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// Función para cargar el carrito desde localStorage
const cargarCarritoDesdeStorage = () => {
  const carritoGuardado = localStorage.getItem('carrito');
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
};

// 2. Crear el Proveedor del Contexto
export function CartProvider({ children }) {
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carritoItems));
  }, [carritoItems]);

  // --- Funciones del Carrito ---

  // Agrega un producto o incrementa su cantidad
  const agregarAlCarrito = (producto) => {
    setCarritoItems(prevItems => {
      const itemExistente = prevItems.find(item => item.codigo === producto.codigo);
      if (itemExistente) {
        return prevItems.map(item =>
          item.codigo === producto.codigo
            ? { ...item, unidades: item.unidades + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...producto, unidades: 1 }];
      }
    });
  };

  // Resta una unidad o elimina si llega a cero
  const restarDelCarrito = (codigo) => {
    setCarritoItems(prevItems => {
      const itemExistente = prevItems.find(item => item.codigo === codigo);
      if (!itemExistente) return prevItems; // No debería pasar, pero por seguridad

      if (itemExistente.unidades === 1) {
        return prevItems.filter(item => item.codigo !== codigo);
      } else {
        return prevItems.map(item =>
          item.codigo === codigo
            ? { ...item, unidades: item.unidades - 1 }
            : item
        );
      }
    });
  };

  // Elimina un producto completamente
  const eliminarDelCarrito = (codigo) => {
    setCarritoItems(prevItems => prevItems.filter(item => item.codigo !== codigo));
  };

  // Vacía el carrito
  const vaciarCarrito = () => {
    setCarritoItems([]);
  };

  // --- Valores Derivados ---
  const totalItems = carritoItems.reduce((acc, item) => acc + item.unidades, 0);
  const totalPrecio = carritoItems.reduce((acc, item) => acc + (item.precio * item.unidades), 0);

  // 3. Valor que proveerá el Contexto
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
}

// 4. Hook personalizado para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}