// En: src/hooks/useCart.jsx

import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// Función para cargar el carrito desde localStorage
const cargarCarritoDesdeStorage = () => {
  console.log("--- CartProvider: Intentando cargar carrito desde localStorage ---");
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      console.log("--- CartProvider: Carrito encontrado en localStorage ---");
      return JSON.parse(carritoGuardado);
    } else {
      console.log("--- CartProvider: No hay carrito en localStorage, devolviendo array vacío ---");
      return [];
    }
  } catch (error) {
    console.error("--- CartProvider: Error al parsear carrito desde localStorage ---", error);
    return []; // Devuelve vacío si hay error
  }
};

// 2. Crear el Proveedor del Contexto
export function CartProvider({ children }) {
  console.log("--- CartProvider: Renderizando ---");
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    console.log("--- CartProvider: useEffect - Guardando carrito en localStorage ---", carritoItems);
    try {
      localStorage.setItem('carrito', JSON.stringify(carritoItems));
    } catch (error) {
      console.error("--- CartProvider: Error al guardar carrito en localStorage ---", error);
    }
  }, [carritoItems]);

  // --- Funciones del Carrito ---

  const agregarAlCarrito = (producto) => {
    console.log("--- CartProvider: Agregando al carrito ---", producto);
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

  const restarDelCarrito = (codigo) => {
     console.log("--- CartProvider: Restando del carrito ---", codigo);
    setCarritoItems(prevItems => {
      const itemExistente = prevItems.find(item => item.codigo === codigo);
      if (!itemExistente) return prevItems; 

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

  const eliminarDelCarrito = (codigo) => {
    console.log("--- CartProvider: Eliminando del carrito ---", codigo);
    setCarritoItems(prevItems => prevItems.filter(item => item.codigo !== codigo));
  };

  const vaciarCarrito = () => {
    console.log("--- CartProvider: Vaciando carrito ---");
    setCarritoItems([]);
  };

  // --- Valores Derivados ---
  const totalItems = carritoItems.reduce((acc, item) => acc + item.unidades, 0);
  const totalPrecio = carritoItems.reduce((acc, item) => acc + (item.precio * item.unidades), 0);
  console.log("--- CartProvider: Calculando totales ---", { totalItems, totalPrecio });

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
    // Este error solo debería ocurrir si olvidamos <CartProvider> en main.jsx
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}