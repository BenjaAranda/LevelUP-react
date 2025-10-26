// En: src/__tests__/cart/Cart.test.jsx (Versión Limpia)

import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
// Usamos nuestro render personalizado
import { render, screen, fireEvent, waitFor } from '../utils/test-utils.jsx';
import '@testing-library/jest-dom';
import Carrito from '../../pages/Carrito.jsx';
// Importamos los providers para poder mockearlos si es necesario
import { AuthProvider } from '../../context/AuthProvider.jsx';
import { CartProvider } from '../../context/CartProvider.jsx';

// Mockeamos la alerta global
beforeEach(() => {
  window.alert = vi.fn();
});
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear(); // Limpiamos localStorage entre pruebas
});

// Mock de datos
const mockProducto1 = { 
  codigo: 'P001', nombre: 'Producto 1', precio: 100, unidades: 2, stock: 5,
  img: '/img1.png', categoria: 'Cat1' 
};
const mockProducto2 = { 
  codigo: 'P002', nombre: 'Producto 2', precio: 50, unidades: 1, stock: 5,
  img: '/img2.png', categoria: 'Cat2'
};

// Creamos un wrapper de renderizado específico para pruebas de carrito
// que nos permita "pre-cargar" el estado del carrito en localStorage
const renderCarritoConItems = (items) => {
  localStorage.setItem('carrito', JSON.stringify(items));
  // Renderizamos el componente Carrito
  return render(<Carrito />);
};


describe('Componente Carrito', () => {

  test('debe mostrar "Tu carrito está vacío" cuando no hay items', () => {
    render(<Carrito />); // Renderiza con los providers por defecto (carrito vacío)
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Finalizar Compra/i })).toBeDisabled();
  });

  test('debe mostrar los items del carrito correctamente desde localStorage', () => {
    // Pre-cargamos el localStorage con items
    renderCarritoConItems([mockProducto1, mockProducto2]);

    // Verifica que los productos están
    expect(screen.getByText(mockProducto1.nombre)).toBeInTheDocument();
    expect(screen.getByText(mockProducto2.nombre)).toBeInTheDocument();
    // Verifica el total (P1: 2*100=200) + (P2: 1*50=50) = 250
    expect(screen.getByText('$ 250')).toBeInTheDocument();
    // Verifica que el botón Finalizar Compra esté habilitado
    expect(screen.getByRole('button', { name: /Finalizar Compra/i })).toBeEnabled();
  });

  test('debe llamar a eliminarDelCarrito al hacer clic en 🗑️', () => {
    renderCarritoConItems([mockProducto1]);
    
    expect(screen.getByText(mockProducto1.nombre)).toBeInTheDocument();
    
    const botonEliminar = screen.getByRole('button', { name: '🗑️' });
    fireEvent.click(botonEliminar);

    // Verificamos que el item desaparece
    expect(screen.queryByText(mockProducto1.nombre)).not.toBeInTheDocument();
    // Verificamos que ahora muestra carrito vacío
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });
  
  test('debe llamar a vaciarCarrito al hacer clic', () => {
    renderCarritoConItems([mockProducto1, mockProducto2]);

    expect(screen.getByText(mockProducto1.nombre)).toBeInTheDocument();

    const botonVaciar = screen.getByRole('button', { name: /Vaciar Carrito/i });
    fireEvent.click(botonVaciar);

    expect(screen.queryByText(mockProducto1.nombre)).not.toBeInTheDocument();
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  test('debe llamar a finalizarCompra y mostrar alerta de éxito', async () => {
    // Pre-cargamos el producto en localStorage
    localStorage.setItem('productos', JSON.stringify([mockProducto1]));
    renderCarritoConItems([mockProducto1]);
    
    const botonFinalizar = screen.getByRole('button', { name: /Finalizar Compra/i });
    fireEvent.click(botonFinalizar);

    // Esperamos a que se resuelva la lógica asíncrona
    await waitFor(() => {
      // Verificamos la alerta de éxito
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('¡Compra realizada con éxito!'));
    });
    
    // Verificamos que el carrito se vació
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

});