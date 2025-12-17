import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { useAuth } from '../hooks/useAuth.jsx';
import client from '../api/axiosClient';

// Helper para cargar del storage inicial
const cargarCarritoDesdeStorage = () => {
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const parsedCart = JSON.parse(carritoGuardado);
      if (Array.isArray(parsedCart)) {
        return parsedCart.map(item => ({ 
            ...item, 
            unidades: item.unidades || item.cantidad || 0 
        }));
      }
    }
    return [];
  } catch (error) { return []; }
};

export const CartProvider = ({ children }) => {
  const [carritoItems, setCarritoItems] = useState(cargarCarritoDesdeStorage);
  const { user } = useAuth(); // Obtenemos el usuario real del contexto
  const [toastMessage, setToastMessage] = useState(null);

  // Persistencia en LocalStorage
  useEffect(() => {
    if (Array.isArray(carritoItems)) {
      try {
        const itemsToSave = carritoItems.map(({ cantidad, ...rest }) => ({ 
            ...rest, 
            unidades: cantidad || rest.unidades 
        }));
        localStorage.setItem('carrito', JSON.stringify(itemsToSave));
      } catch (error) {
        console.error("Error al guardar carrito:", error);
      }
    }
  }, [carritoItems]);

  // --- Lógica del Carrito (Agregar/Quitar) ---

  const agregarAlCarrito = (producto) => {
    if (!producto || !producto.codigo) return;
    
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
          // Normalizamos para asegurar que tenga 'unidades'
          const productoParaAgregar = { ...producto, unidades: 1 };
          newCart = [...currentItems, productoParaAgregar];
        }
        setToastMessage(producto.nombre);
        return newCart;
      } else {
        alert(`Stock insuficiente para "${producto.nombre}". Disponible: ${stockActual}.`);
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
    setCarritoItems(prevItems => 
        (Array.isArray(prevItems) ? prevItems : []).filter(item => item.codigo !== codigo)
    );
  };

  const vaciarCarrito = () => {
    setCarritoItems([]);
  };

  // --- CHECKOUT CONECTADO AL BACKEND ---
  const finalizarCompraYActualizarStock = async (direccionEnvio) => {
    const currentCartItems = Array.isArray(carritoItems) ? carritoItems : [];
    
    if (currentCartItems.length === 0) {
      alert("El carrito está vacío.");
      return { exito: false, ordenId: null };
    }

    if (!user || !user.email) {
        alert("Debes iniciar sesión para comprar.");
        return { exito: false, ordenId: null };
    }

    const compraTotal = currentCartItems.reduce((acc, item) => 
        acc + ((item.precio || 0) * (item.unidades || 0)), 0);

    try {
      // Construimos el Payload EXACTO que espera el VentaController
      const ventaPayload = {
        usuarioEmail: user.email,
        totalVenta: compraTotal,
        
        // Mapeamos los datos de dirección que vienen del formulario Checkout
        calle: direccionEnvio.calle,
        numero: direccionEnvio.numero,
        departamento: direccionEnvio.departamento || "",
        comuna: direccionEnvio.comuna,
        region: direccionEnvio.region,
        telefono: direccionEnvio.telefono,

        // Lista de items
        items: currentCartItems.map(item => ({
          productoCodigo: item.codigo,
          cantidad: item.unidades,
          precioUnitario: item.precio
        }))
      };

      // Enviamos al Backend
      const response = await client.post('/ventas', ventaPayload);
      
      // Si llegamos aquí, fue exitoso (200 OK)
      vaciarCarrito();
      
      // Retornamos el ID real generado por la base de datos
      return { exito: true, ordenId: response.data.id };

    } catch (error) {
      console.error("Error checkout:", error);
      const msg = error.response?.data || "Error de conexión con el servidor";
      alert(`Error al procesar la compra: ${msg}`);
      return { exito: false, ordenId: null };
    }
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  // Totales calculados
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
    finalizarCompraYActualizarStock, // Esta es la función clave actualizada
    toastMessage,
    clearToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};