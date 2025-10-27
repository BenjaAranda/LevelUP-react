// En: src/context/CartProvider.jsx (Actualizado)

import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { getProductos, saveProductos } from '../data/productos.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { guardarOrden } from '../data/ordenes.js';

const cargarCarritoDesdeStorage = () => {
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const parsedCart = JSON.parse(carritoGuardado);
      if (Array.isArray(parsedCart)) {
        return parsedCart.map(item => ({ ...item, unidades: item.unidades || item.cantidad || 0 }));
      } else { return []; }
    } else { return []; }
  } catch (error) { return []; }
};

export const CartProvider = ({ children }) => {
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);
  const { usuario } = useAuth();

  // --- ¡NUEVO ESTADO PARA EL TOAST! ---
  const [toastMessage, setToastMessage] = useState(null); // Mensaje a mostrar

  useEffect(() => {
    if (Array.isArray(carritoItems)) {
      try {
        const itemsToSave = carritoItems.map(({ cantidad, ...rest }) => ({ ...rest, unidades: cantidad || rest.unidades }));
        localStorage.setItem('carrito', JSON.stringify(itemsToSave));
      } catch (error) {
        console.error("Error al guardar carrito en localStorage ---", error);
      }
    }
  }, [carritoItems]);

  // --- Funciones del Carrito ---

  const agregarAlCarrito = (producto) => {
    if (!producto || !producto.codigo) return;

    const productosActuales = getProductos();
    const productoEnStorage = productosActuales.find(p => p.codigo === producto.codigo);
    const stockActual = productoEnStorage ? productoEnStorage.stock : 0;

    setCarritoItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExistente = currentItems.find(item => item.codigo === producto.codigo);
      const cantidadActualEnCarrito = itemExistente ? itemExistente.unidades : 0;

      if (stockActual > cantidadActualEnCarrito) {
        let newCart;
        if (itemExistente) {
          newCart = currentItems.map(item =>
            item.codigo === producto.codigo
              ? { ...item, unidades: item.unidades + 1 }
              : item
          );
        } else {
          const productoParaAgregar = productoEnStorage ? { ...productoEnStorage, unidades: 1 } : { ...producto, unidades: 1 };
          newCart = [...currentItems, productoParaAgregar];
        }
        
        // --- ¡MOSTRAR TOAST DE ÉXITO! ---
        setToastMessage(producto.nombre); // Seteamos el nombre del producto
        
        return newCart;
      } else {
        alert(`No hay suficiente stock para "${producto.nombre}". Stock actual: ${stockActual}, en carrito: ${cantidadActualEnCarrito}.`);
        return currentItems;
      }
    });
  };

  const restarDelCarrito = (codigo) => {
    setCarritoItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExistente = currentItems.find(item => item.codigo === codigo);
      if (!itemExistente) return currentItems;
      if (itemExistente.unidades === 1) {
        return currentItems.filter(item => item.codigo !== codigo);
      } else {
        return currentItems.map(item =>
          item.codigo === codigo
            ? { ...item, unidades: item.unidades - 1 }
            : item
        );
      }
    });
  };

  const eliminarDelCarrito = (codigo) => {
    setCarritoItems(prevItems => (Array.isArray(prevItems) ? prevItems : []).filter(item => item.codigo !== codigo));
  };

  const vaciarCarrito = () => {
    setCarritoItems([]);
  };

  const finalizarCompraYActualizarStock = (direccionEnvio) => {
    const currentCartItems = Array.isArray(carritoItems) ? carritoItems : [];
    if (currentCartItems.length === 0) {
      alert("El carrito está vacío.");
      return { exito: false, ordenId: null };
    }
    const productosActuales = getProductos();
    let stockSuficiente = true;
    let productosParaActualizar = [...productosActuales];
    let compraTotal = 0;

    for (const item of currentCartItems) {
      const productoEnStorage = productosParaActualizar.find(p => p.codigo === item.codigo);
      if (!productoEnStorage || productoEnStorage.stock < item.unidades) {
        alert(`¡Stock insuficiente para "${item.nombre}"! Stock actual: ${productoEnStorage?.stock || 0}. Por favor, ajusta tu carrito.`);
        stockSuficiente = false;
        break;
      }
      const index = productosParaActualizar.findIndex(p => p.codigo === item.codigo);
      productosParaActualizar[index] = {
        ...productoEnStorage,
        stock: productoEnStorage.stock - item.unidades
      };
      compraTotal += (item.precio || 0) * (item.unidades || 0);
    }

    if (stockSuficiente) {
      try {
        const nuevaOrden = {
          id: Date.now(),
          fecha: new Date().toISOString(),
          usuarioEmail: usuario ? usuario.email : 'Invitado',
          items: currentCartItems.map(({ cantidad, ...rest }) => ({ ...rest, unidades: cantidad || rest.unidades })),
          total: compraTotal,
          direccionEnvio: direccionEnvio
        };
        guardarOrden(nuevaOrden);
        saveProductos(productosParaActualizar);
        vaciarCarrito();
        return { exito: true, ordenId: nuevaOrden.id };
      } catch (error) {
        console.error("Error al guardar orden o actualizar productos:", error);
        alert("Ocurrió un error al procesar la compra. Intenta de nuevo.");
        return { exito: false, ordenId: null };
      }
    } else {
      return { exito: false, ordenId: null };
    }
  };

  // --- ¡NUEVA FUNCIÓN PARA LIMPIAR EL TOAST! ---
  const clearToast = () => {
    setToastMessage(null);
  };

  // --- Valores Derivados ---
  const currentSafeCartItems = Array.isArray(carritoItems) ? carritoItems : [];
  const totalItems = currentSafeCartItems.reduce((acc, item) => acc + (item.unidades || 0), 0);
  const totalPrecio = currentSafeCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);

  // --- VALOR DEL CONTEXTO (ACTUALIZADO) ---
  const value = {
    carritoItems: currentSafeCartItems,
    agregarAlCarrito,
    restarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPrecio,
    finalizarCompraYActualizarStock,
    // --- Exponemos el estado y la función del toast ---
    toastMessage,
    clearToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};