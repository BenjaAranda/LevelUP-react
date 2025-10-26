// En: src/context/CartProvider.jsx (Corregido y Completo)

import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext'; // Importa el contexto vecino
// Importamos funciones de productos y Auth
import { getProductos, saveProductos } from '../data/productos.js';
import { useAuth } from '../hooks/useAuth.jsx'; // Asumiendo que useAuth está en hooks
import { guardarOrden } from '../data/ordenes.js'; // Para guardar la orden

// Función para cargar el carrito desde localStorage (usando 'carrito' como clave)
const cargarCarritoDesdeStorage = () => {
  console.log("--- CartProvider: Intentando cargar carrito desde localStorage ---");
  try {
    const carritoGuardado = localStorage.getItem('carrito'); // USAMOS 'carrito'
    if (carritoGuardado) {
      const parsedCart = JSON.parse(carritoGuardado);
      if(Array.isArray(parsedCart)) {
          console.log("--- CartProvider: Carrito cargado:", parsedCart);
          // Asegurarse de que los items tengan 'unidades' y no 'cantidad' si es necesario
          return parsedCart.map(item => ({...item, unidades: item.unidades || item.cantidad || 0 }));
      } else {
          console.warn("--- CartProvider: Datos en localStorage ('carrito') no son un array. Devolviendo vacío. ---");
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

export const CartProvider = ({ children }) => {
  console.log("--- CartProvider: Renderizando ---");
  // Usamos 'carritoItems' como nombre de estado y 'unidades' como propiedad
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);
  const { usuario } = useAuth();

  // Guardar en localStorage (usando 'carrito' como clave)
  useEffect(() => {
    console.log("--- CartProvider: useEffect - Guardando carrito:", carritoItems);
    if (Array.isArray(carritoItems)) {
        try {
          // Guardamos items asegurando que tengan 'unidades'
          const itemsToSave = carritoItems.map(({cantidad, ...rest}) => ({...rest, unidades: cantidad || rest.unidades}));
          localStorage.setItem('carrito', JSON.stringify(itemsToSave));
          console.log("--- CartProvider: useEffect - Carrito guardado en localStorage.");
        } catch (error) {
          console.error("--- CartProvider: Error al guardar carrito en localStorage ---", error);
        }
    }
  }, [carritoItems]);

  // --- Funciones del Carrito (CON LÓGICA CORRECTA Y NOMBRES ORIGINALES) ---

  const agregarAlCarrito = (producto) => {
    console.log("--- CartProvider: Agregando al carrito ---", producto?.nombre);
    if (!producto || !producto.codigo) {
        console.error("Intento de agregar producto inválido:", producto);
        return; // No hacer nada si el producto no es válido
    }
    const productosActuales = getProductos();
    const productoEnStorage = productosActuales.find(p => p.codigo === producto.codigo);
    const stockActual = productoEnStorage ? productoEnStorage.stock : 0;
    console.log(`--- CartProvider: Stock actual para ${producto.nombre}: ${stockActual}`);

    setCarritoItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExistente = currentItems.find(item => item.codigo === producto.codigo);
      const cantidadActualEnCarrito = itemExistente ? itemExistente.unidades : 0;
      console.log(`--- CartProvider: Cantidad actual en carrito para ${producto.nombre}: ${cantidadActualEnCarrito}`);

      if (stockActual > cantidadActualEnCarrito) {
        let newCart;
        if (itemExistente) {
          console.log("--- CartProvider: Incrementando unidades...");
          newCart = currentItems.map(item =>
            item.codigo === producto.codigo
              ? { ...item, unidades: item.unidades + 1 } // Usamos 'unidades'
              : item
          );
        } else {
          console.log("--- CartProvider: Añadiendo nuevo producto...");
          // Aseguramos usar datos frescos del storage y 'unidades'
          const productoParaAgregar = productoEnStorage ? {...productoEnStorage, unidades: 1} : {...producto, unidades: 1};
          newCart = [...currentItems, productoParaAgregar];
        }
        console.log("--- CartProvider: NUEVO estado del carrito:", newCart);
        return newCart;
      } else {
        console.warn(`--- CartProvider: Stock insuficiente para ${producto.nombre}. No se agregó.`);
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

      if (itemExistente.unidades === 1) { // Usamos 'unidades'
        return currentItems.filter(item => item.codigo !== codigo);
      } else {
        return currentItems.map(item =>
          item.codigo === codigo
            ? { ...item, unidades: item.unidades - 1 } // Usamos 'unidades'
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

  // --- FUNCIÓN FINALIZAR COMPRA CON ACTUALIZACIÓN DE STOCK ---
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
      // Usamos item.precio y item.unidades que vienen del carrito
      compraTotal += (item.precio || 0) * (item.unidades || 0);
      console.log(`Stock para ${item.nombre} será actualizado a ${productosParaActualizar[index].stock}`);
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

        guardarOrden(nuevaOrden); // Guarda la orden
        saveProductos(productosParaActualizar); // Actualiza stock en productos.js
        vaciarCarrito(); // Vacía el carrito local
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


  // --- Valores Derivados (Usando 'unidades') ---
  const currentSafeCartItems = Array.isArray(carritoItems) ? carritoItems : [];
  const totalItems = currentSafeCartItems.reduce((acc, item) => acc + (item.unidades || 0), 0);
  const totalPrecio = currentSafeCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);
  // console.log("--- CartProvider: Calculando totales ---", { totalItems, totalPrecio });

  // --- VALOR DEL CONTEXTO (Usando nombres originales) ---
  const value = {
    carritoItems: currentSafeCartItems, // Pasamos la versión segura con 'unidades'
    agregarAlCarrito,        // Nombre original
    restarDelCarrito,        // Nombre original
    eliminarDelCarrito,      // Nombre original
    vaciarCarrito,           // Nombre original
    totalItems,
    totalPrecio,             // Nombre original
    finalizarCompraYActualizarStock
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};