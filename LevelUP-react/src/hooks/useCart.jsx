// En: src/hooks/useCart.jsx (Corregido)

import React, { useState, useEffect, createContext, useContext } from 'react';
import { getProductos, saveProductos } from '../data/productos.js'; 

// 1. Crear el Contexto
const CartContext = createContext();

// Función para cargar el carrito desde localStorage
const cargarCarritoDesdeStorage = () => {
  console.log("--- CartProvider: Intentando cargar carrito desde localStorage ---");
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const parsedCart = JSON.parse(carritoGuardado);
      // Verificación extra: Asegurar que sea un array
      if(Array.isArray(parsedCart)) {
          console.log("--- CartProvider: Carrito encontrado en localStorage ---");
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
    // --- CORRECCIÓN CLAVE ---
    // Devolver array vacío si hay error al parsear
    return []; 
    // --- FIN CORRECCIÓN ---
  }
};

// 2. Crear el Proveedor del Contexto
export function CartProvider({ children }) {
  console.log("--- CartProvider: Renderizando ---");
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    console.log("--- CartProvider: useEffect - Guardando carrito en localStorage ---", carritoItems);
    // Verificación adicional antes de guardar
    if (Array.isArray(carritoItems)) {
        try {
          localStorage.setItem('carrito', JSON.stringify(carritoItems));
        } catch (error) {
          console.error("--- CartProvider: Error al guardar carrito en localStorage ---", error);
        }
    } else {
        console.error("--- CartProvider: Intentando guardar algo que no es array en carrito:", carritoItems);
    }
  }, [carritoItems]);

  // --- Funciones del Carrito ---

  const agregarAlCarrito = (producto) => {
    console.log("--- CartProvider: Agregando al carrito ---", producto);
    const productosActuales = getProductos();
    const productoEnStorage = productosActuales.find(p => p.codigo === producto.codigo);
    const stockActual = productoEnStorage ? productoEnStorage.stock : 0;

    setCarritoItems(prevItems => {
      // Asegurarse que prevItems sea un array
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExistente = currentItems.find(item => item.codigo === producto.codigo);
      const cantidadActualEnCarrito = itemExistente ? itemExistente.unidades : 0;

      if (stockActual > cantidadActualEnCarrito) {
        if (itemExistente) {
          return currentItems.map(item =>
            item.codigo === producto.codigo
              ? { ...item, unidades: item.unidades + 1 }
              : item
          );
        } else {
          const productoParaAgregar = productoEnStorage ? {...productoEnStorage, unidades: 1} : {...producto, unidades: 1};
          return [...currentItems, productoParaAgregar];
        }
      } else {
        alert(`No hay suficiente stock para "${producto.nombre}". Stock actual: ${stockActual}, en carrito: ${cantidadActualEnCarrito}.`);
        return currentItems; 
      }
    });
  };

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
    // Asegurarse que carritoItems sea un array antes de iterar
    const currentCartItems = Array.isArray(carritoItems) ? carritoItems : [];
    if (currentCartItems.length === 0) {
        alert("El carrito está vacío.");
        return false;
    }

    const productosActuales = getProductos(); 
    let stockSuficiente = true;
    let productosParaActualizar = [...productosActuales]; 

    for (const item of currentCartItems) { // Usamos currentCartItems
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
      console.log(`Stock para ${item.nombre} será actualizado a ${productosParaActualizar[index].stock}`);
    }

    if (stockSuficiente) {
      try {
        saveProductos(productosParaActualizar); 
        vaciarCarrito(); 
        console.log("Compra finalizada y stock actualizado.");
        return true; 
      } catch (error) {
         console.error("Error al guardar productos actualizados:", error);
         alert("Ocurrió un error al actualizar el stock. Intenta de nuevo.");
         return false; 
      }
    } else {
        console.log("Finalización de compra cancelada por falta de stock.");
        return false; 
    }
  };

  // --- Valores Derivados (con safeguard) ---
  // Aseguramos que carritoItems sea un array antes de usar reduce
  const currentSafeCartItems = Array.isArray(carritoItems) ? carritoItems : [];
  const totalItems = currentSafeCartItems.reduce((acc, item) => acc + (item.unidades || 0), 0);
  const totalPrecio = currentSafeCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);
  console.log("--- CartProvider: Calculando totales ---", { totalItems, totalPrecio });

  const value = {
    carritoItems: currentSafeCartItems, // Pasamos la versión segura
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

// 4. Hook personalizado para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}