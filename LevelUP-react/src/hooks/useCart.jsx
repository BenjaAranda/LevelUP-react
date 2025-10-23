// En: src/hooks/useCart.jsx

import React, { useState, createContext, useContext } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Crear el Proveedor del Contexto
// Este componente envolverá a toda nuestra aplicación
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // El estado del carrito

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    // Revisar si el producto ya está en el carrito
    const productoEnCarritoIndex = cart.findIndex(item => item.codigo === producto.codigo);

    if (productoEnCarritoIndex >= 0) {
      // Si ya está, creamos una copia del carrito
      const newCart = [...cart];
      // Y aumentamos la cantidad de ese producto
      newCart[productoEnCarritoIndex].cantidad += 1;
      setCart(newCart);
    } else {
      // Si no está, lo agregamos al carrito con cantidad 1
      setCart(prevCart => [
        ...prevCart,
        { ...producto, cantidad: 1 }
      ]);
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (codigo) => {
    setCart(prevCart => prevCart.filter(item => item.codigo !== codigo));
  };

  // Función para limpiar el carrito
  const limpiarCarrito = () => {
    setCart([]);
  };

  // 3. Exponemos el estado y las funciones a los componentes hijos
  return (
    <CartContext.Provider value={{
      cart,
      agregarAlCarrito,
      eliminarDelCarrito,
      limpiarCarrito
    }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Crear un "hook" personalizado para usar el contexto fácilmente
// Esto es lo que importa tu archivo Productos.jsx
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  return context;
}