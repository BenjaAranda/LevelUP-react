// En: src/hooks/useCart.jsx (Actualizado)

import React, { useState, useEffect, createContext, useContext } from 'react';
import { getProductos, saveProductos } from '../data/productos.js'; 
import { useAuth } from './useAuth.jsx'; 
// Importamos getOrdenes y guardarOrden
import { guardarOrden, getOrdenes } from '../data/ordenes.js'; 

const CartContext = createContext();

const cargarCarritoDesdeStorage = () => {
  // console.log("--- CartProvider: Intentando cargar carrito desde localStorage ---");
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const parsedCart = JSON.parse(carritoGuardado);
      if(Array.isArray(parsedCart)) {
          // console.log("--- CartProvider: Carrito cargado:", parsedCart);
          return parsedCart.map(item => ({...item, unidades: item.unidades || item.cantidad || 0 }));
      } else {
          // console.warn("--- CartProvider: Datos en localStorage ('carrito') no son un array. Devolviendo vacío. ---");
          return [];
      }
    } else {
      // console.log("--- CartProvider: No hay carrito en localStorage, devolviendo array vacío ---");
      return []; 
    }
  } catch (error) {
    console.error("--- CartProvider: Error al parsear carrito desde localStorage ---", error);
    return []; 
  }
};

export function CartProvider({ children }) {
  // console.log("--- CartProvider: Renderizando ---");
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);
  const { usuario } = useAuth(); 

  useEffect(() => {
    // console.log("--- CartProvider: useEffect - Guardando carrito:", carritoItems);
    if (Array.isArray(carritoItems)) {
        try {
          const itemsToSave = carritoItems.map(({cantidad, ...rest}) => ({...rest, unidades: cantidad || rest.unidades}));
          localStorage.setItem('carrito', JSON.stringify(itemsToSave));
          // console.log("--- CartProvider: useEffect - Carrito guardado en localStorage.");
        } catch (error) {
          console.error("--- CartProvider: Error al guardar carrito en localStorage ---", error);
        }
    }
  }, [carritoItems]);

  // --- Funciones del Carrito (agregar, restar, eliminar, vaciar) ---
  // (Estas funciones se mantienen igual que en la versión anterior y funcional)
  
  const agregarAlCarrito = (producto) => {
    // console.log("--- CartProvider: Agregando al carrito ---", producto?.nombre);
    if (!producto || !producto.codigo) {
        console.error("Intento de agregar producto inválido:", producto);
        return; 
    }
    const productosActuales = getProductos();
    const productoEnStorage = productosActuales.find(p => p.codigo === producto.codigo);
    const stockActual = productoEnStorage ? productoEnStorage.stock : 0;
    // console.log(`--- CartProvider: Stock actual para ${producto.nombre}: ${stockActual}`);

    setCarritoItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExistente = currentItems.find(item => item.codigo === producto.codigo);
      const cantidadActualEnCarrito = itemExistente ? itemExistente.unidades : 0;
      // console.log(`--- CartProvider: Cantidad actual en carrito para ${producto.nombre}: ${cantidadActualEnCarrito}`);

      if (stockActual > cantidadActualEnCarrito) {
        let newCart;
        if (itemExistente) {
          // console.log("--- CartProvider: Incrementando unidades...");
          newCart = currentItems.map(item =>
            item.codigo === producto.codigo
              ? { ...item, unidades: item.unidades + 1 } 
              : item
          );
        } else {
          // console.log("--- CartProvider: Añadiendo nuevo producto...");
          const productoParaAgregar = productoEnStorage ? {...productoEnStorage, unidades: 1} : {...producto, unidades: 1};
          newCart = [...currentItems, productoParaAgregar];
        }
        // console.log("--- CartProvider: NUEVO estado del carrito:", newCart);
        return newCart;
      } else {
        // console.warn(`--- CartProvider: Stock insuficiente para ${producto.nombre}. No se agregó.`);
        alert(`No hay suficiente stock para "${producto.nombre}". Stock actual: ${stockActual}, en carrito: ${cantidadActualEnCarrito}.`);
        return currentItems;
      }
    });
  };

  const restarDelCarrito = (codigo) => {
    // console.log("--- CartProvider: Restando del carrito ---", codigo);
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
    // console.log("--- CartProvider: Eliminando del carrito ---", codigo);
    setCarritoItems(prevItems => (Array.isArray(prevItems) ? prevItems : []).filter(item => item.codigo !== codigo));
  };

  const vaciarCarrito = () => {
    // console.log("--- CartProvider: Vaciando carrito ---");
    setCarritoItems([]);
  };

  // --- FUNCIÓN FINALIZAR COMPRA ACTUALIZADA ---
  // Ahora devuelve un objeto { exito: boolean, ordenId: number | null }
  const finalizarCompraYActualizarStock = () => {
    console.log("Intentando finalizar compra...");
    const currentCartItems = Array.isArray(carritoItems) ? carritoItems : [];
    if (currentCartItems.length === 0) {
        alert("El carrito está vacío.");
        return { exito: false, ordenId: null }; // Devolvemos objeto de fallo
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
            // Aseguramos guardar con 'unidades'
            items: currentCartItems.map(({cantidad, ...rest}) => ({...rest, unidades: cantidad || rest.unidades})),
            total: compraTotal
        };
        console.log("Nueva Orden creada:", nuevaOrden);

        guardarOrden(nuevaOrden); 
        saveProductos(productosParaActualizar); 
        vaciarCarrito(); 
        console.log("Compra finalizada, orden guardada y stock actualizado.");
        // --- DEVOLVEMOS ÉXITO Y EL ID DE LA ORDEN ---
        return { exito: true, ordenId: nuevaOrden.id }; 
      } catch (error) {
         console.error("Error al guardar orden o actualizar productos:", error);
         alert("Ocurrió un error al procesar la compra. Intenta de nuevo.");
         return { exito: false, ordenId: null }; // Devolvemos objeto de fallo
      }
    } else {
        console.log("Finalización de compra cancelada por falta de stock.");
        return { exito: false, ordenId: null }; // Devolvemos objeto de fallo
    }
  };
  // --- FIN FUNCIÓN FINALIZAR COMPRA ---

  // --- Valores Derivados (sin cambios) ---
  const currentSafeCartItems = Array.isArray(carritoItems) ? carritoItems : [];
  const totalItems = currentSafeCartItems.reduce((acc, item) => acc + (item.unidades || 0), 0);
  const totalPrecio = currentSafeCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);

  // --- VALOR DEL CONTEXTO (sin cambios) ---
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

// Hook personalizado (sin cambios)
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}