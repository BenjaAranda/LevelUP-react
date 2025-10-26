// En: src/hooks/useCart.jsx (Con Logs)

import React, { useState, useEffect, createContext, useContext } from 'react';
import { getProductos, saveProductos } from '../data/productos.js'; 
import { useAuth } from './useAuth.jsx'; 
import { guardarOrden } from '../data/ordenes.js'; 

const CartContext = createContext();

const cargarCarritoDesdeStorage = () => {
  console.log("--- CartProvider: Intentando cargar carrito desde localStorage ---");
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const parsedCart = JSON.parse(carritoGuardado);
      if(Array.isArray(parsedCart)) {
          console.log("--- CartProvider: Carrito cargado:", parsedCart);
          return parsedCart;
      } else {
          console.warn("--- CartProvider: Datos en localStorage no son un array. Devolviendo vacío. ---");
          return [];
      }
    } else {
      console.log("--- CartProvider: No hay carrito en localStorage, devolviendo array vacío ---");
      return []; 
    }
  } catch (error) {
    console.error("--- CartProvider: Error al parsear carrito desde localStorage ---", error);
    return []; 
  }
};

export function CartProvider({ children }) {
  console.log("--- CartProvider: Renderizando ---");
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);
  const { usuario } = useAuth(); 

  // Efecto para guardar
  useEffect(() => {
    console.log("--- CartProvider: useEffect - Estado carritoItems cambió:", carritoItems);
    if (Array.isArray(carritoItems)) {
        try {
          localStorage.setItem('carrito', JSON.stringify(carritoItems));
          console.log("--- CartProvider: useEffect - Carrito guardado en localStorage.");
        } catch (error) {
          console.error("--- CartProvider: Error al guardar carrito en localStorage ---", error);
        }
    } else {
        console.error("--- CartProvider: Intentando guardar algo que no es array en carrito:", carritoItems);
    }
  }, [carritoItems]); // Se ejecuta CADA VEZ que carritoItems cambia

  // --- Funciones del Carrito ---

  const agregarAlCarrito = (producto) => {
    console.log("--- CartProvider: LLAMADO A agregarAlCarrito ---", producto); // Log inicial
    const productosActuales = getProductos();
    const productoEnStorage = productosActuales.find(p => p.codigo === producto.codigo);
    const stockActual = productoEnStorage ? productoEnStorage.stock : 0;
    console.log(`--- CartProvider: Stock actual para ${producto.nombre}: ${stockActual}`);

    // Usamos la forma funcional de setState para asegurar el estado previo correcto
    setCarritoItems(prevItems => {
      console.log("--- CartProvider: Estado PREVIO del carrito:", prevItems);
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExistente = currentItems.find(item => item.codigo === producto.codigo);
      const cantidadActualEnCarrito = itemExistente ? itemExistente.unidades : 0;
      console.log(`--- CartProvider: Cantidad actual en carrito para ${producto.nombre}: ${cantidadActualEnCarrito}`);

      if (stockActual > cantidadActualEnCarrito) {
        let newCart;
        if (itemExistente) {
          console.log("--- CartProvider: Incrementando cantidad...");
          newCart = currentItems.map(item =>
            item.codigo === producto.codigo
              ? { ...item, unidades: item.unidades + 1 }
              : item
          );
        } else {
          console.log("--- CartProvider: Añadiendo nuevo producto...");
          const productoParaAgregar = productoEnStorage ? {...productoEnStorage, unidades: 1} : {...producto, unidades: 1};
          newCart = [...currentItems, productoParaAgregar];
        }
        console.log("--- CartProvider: NUEVO estado del carrito:", newCart); // Log del nuevo estado
        return newCart; // Devolvemos el nuevo array
      } else {
        console.warn(`--- CartProvider: Stock insuficiente para ${producto.nombre}. No se agregó.`);
        alert(`No hay suficiente stock para "${producto.nombre}". Stock actual: ${stockActual}, en carrito: ${cantidadActualEnCarrito}.`);
        return currentItems; // Devolvemos el estado sin cambios
      }
    });
  };

  // ... (resto de funciones: restar, eliminar, vaciar, finalizarCompra...) ...
    const restarDelCarrito = (codigo) => {
     console.log("--- CartProvider: Restando del carrito ---", codigo);
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
    console.log("--- CartProvider: Eliminando del carrito ---", codigo);
    setCarritoItems(prevItems => (Array.isArray(prevItems) ? prevItems : []).filter(item => item.codigo !== codigo));
  };

  const vaciarCarrito = () => {
    console.log("--- CartProvider: Vaciando carrito ---");
    setCarritoItems([]);
  };

  const finalizarCompraYActualizarStock = () => {
    console.log("Intentando finalizar compra...");
    const currentCartItems = Array.isArray(carritoItems) ? carritoItems : [];
    if (currentCartItems.length === 0) {
        alert("El carrito está vacío.");
        return false; 
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
      compraTotal += item.precio * item.unidades;
      console.log(`Stock para ${item.nombre} será actualizado a ${productosParaActualizar[index].stock}`);
    }

    if (stockSuficiente) {
      try {
        const nuevaOrden = {
            id: Date.now(), 
            fecha: new Date().toISOString(), 
            usuarioEmail: usuario ? usuario.email : 'Invitado', 
            items: [...currentCartItems], 
            total: compraTotal
        };
        console.log("Nueva Orden creada:", nuevaOrden);

        guardarOrden(nuevaOrden); 
        saveProductos(productosParaActualizar); 
        vaciarCarrito(); 
        console.log("Compra finalizada, orden guardada y stock actualizado.");
        return true; 
      } catch (error) {
         console.error("Error al guardar orden o actualizar productos:", error);
         alert("Ocurrió un error al procesar la compra. Intenta de nuevo.");
         return false; 
      }
    } else {
        console.log("Finalización de compra cancelada por falta de stock.");
        return false; 
    }
  };


  // --- Valores Derivados ---
  const currentSafeCartItems = Array.isArray(carritoItems) ? carritoItems : [];
  const totalItems = currentSafeCartItems.reduce((acc, item) => acc + (item.unidades || 0), 0);
  const totalPrecio = currentSafeCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);
  // console.log("--- CartProvider: Calculando totales ---", { totalItems, totalPrecio });

  const value = {
    carritoItems: currentSafeCartItems,
    agregarAlCarrito,
    restarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPrecio,
    finalizarCompraYActualizarStock
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook personalizado
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}