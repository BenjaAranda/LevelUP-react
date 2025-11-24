import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';
// Importamos el hook useAuth para obtener el usuario real (user)
import { useAuth } from '../hooks/useAuth.jsx';
// Importamos el cliente API para enviar la venta al backend
import client from '../api/axiosClient';

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
  
  // CORRECCIÓN 1: Usamos 'user' (que es como lo devuelve AuthProvider ahora), no 'usuario'
  const { user } = useAuth();
  
  const [toastMessage, setToastMessage] = useState(null);

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

  const agregarAlCarrito = (producto) => {
    if (!producto || !producto.codigo) return;
    
    // Ya no validamos stock local estricto porque el backend tiene la verdad
    // pero usamos el stock que viene en el objeto para una validación visual rápida
    const stockActual = producto.stock || 0;

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
          const productoParaAgregar = { ...producto, unidades: 1 };
          newCart = [...currentItems, productoParaAgregar];
        }
        setToastMessage(producto.nombre);
        return newCart;
      } else {
        alert(`No hay suficiente stock para "${producto.nombre}". Stock disponible: ${stockActual}.`);
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

  // --- FUNCIÓN DE CHECKOUT REAL ---
  const finalizarCompraYActualizarStock = async (direccionEnvio) => {
    const currentCartItems = Array.isArray(carritoItems) ? carritoItems : [];
    
    if (currentCartItems.length === 0) {
      alert("El carrito está vacío.");
      return { exito: false, ordenId: null };
    }

    // Validación de seguridad: ¿Hay usuario logueado?
    if (!user || !user.email) {
        alert("Error de sesión: No se detecta el usuario logueado.");
        return { exito: false, ordenId: null };
    }

    const compraTotal = currentCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);

    try {
      // Payload para el Backend
      const ventaPayload = {
        usuarioEmail: user.email, // CORRECCIÓN 2: Usamos user.email real
        totalVenta: compraTotal,
        // Dirección opcional si tu backend la guarda
        // direccion: direccionEnvio, 
        items: currentCartItems.map(item => ({
          productoCodigo: item.codigo,
          cantidad: item.unidades,
          precioUnitario: item.precio
        }))
      };

      // POST al Backend
      const response = await client.post('/ventas', ventaPayload);
      
      // Éxito
      vaciarCarrito();
      
      // Retornamos el ID real de la base de datos (ej: 1, 2, 3...)
      return { exito: true, ordenId: response.data.id };

    } catch (error) {
      console.error("Error al procesar venta:", error);
      alert("Error al procesar la compra: " + (error.response?.data || "Error de servidor"));
      return { exito: false, ordenId: null };
    }
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const currentSafeCartItems = Array.isArray(carritoItems) ? carritoItems : [];
  const totalItems = currentSafeCartItems.reduce((acc, item) => acc + (item.unidades || 0), 0);
  const totalPrecio = currentSafeCartItems.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0);

  const value = {
    carritoItems: currentSafeCartItems,
    agregarAlCarrito,
    restarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPrecio,
    finalizarCompraYActualizarStock,
    toastMessage,
    clearToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};