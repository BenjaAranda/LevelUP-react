// En: src/context/CartProvider.jsx
import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

// Función para cargar el carrito desde localStorage
const cargarCarritoDesdeStorage = () => {
  try {
    const carritoGuardado = localStorage.getItem('cart');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // El estado del carrito se inicializa con lo que haya en localStorage
  const [cart, setCart] = useState(cargarCarritoDesdeStorage);

  // Efecto para guardar en localStorage CADA VEZ que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // --- Funciones del Carrito ---

  const addToCart = (producto) => {
    setCart(prevItems => {
      const existingItem = prevItems.find(item => item.codigo === producto.codigo);

      if (existingItem) {
        return prevItems.map(item =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: (item.cantidad || 0) + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  const removeOne = (codigo) => {
    setCart(prevItems => {
      const existingItem = prevItems.find(item => item.codigo === codigo);

      if (existingItem?.cantidad === 1) {
        // Si la cantidad es 1, lo elimina del carrito
        return prevItems.filter(item => item.codigo !== codigo);
      } else {
        // Si es > 1, resta la cantidad
        return prevItems.map(item =>
          item.codigo === codigo
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      }
    });
  };

  // Elimina un producto
  const removeFromCart = (codigo) => {
    setCart(prevItems => prevItems.filter(item => item.codigo !== codigo));
  };

  // Vacía el carrito
  const clearCart = () => {
    setCart([]);
  };

  // --- Valores Derivados (para mostrar en el resumen) ---
  const totalItems = cart.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.precio * (item.cantidad || 0)), 0);

  // Función para finalizar la compra
  const finalizarCompraYActualizarStock = async () => {
    // Aquí iría la lógica para actualizar el stock en el servidor
    // Por ahora solo simulamos que fue exitoso
    clearCart();
    return true;
  };

  const value = {
    cart,
    addToCart,
    removeOne,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
    finalizarCompraYActualizarStock
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};