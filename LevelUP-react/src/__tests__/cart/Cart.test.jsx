import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils.jsx';
import '@testing-library/jest-dom';
import Carrito from '../../pages/Carrito.jsx';

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

// Helper que renderiza `Carrito` pasando un `cartContext` simulado
const renderCarritoConItems = (items = []) => {
  const mockCartContext = {
    carritoItems: items,
    agregarAlCarrito: vi.fn(),
    restarDelCarrito: vi.fn(),
    eliminarDelCarrito: vi.fn(),
    vaciarCarrito: vi.fn(),
    totalItems: items.reduce((acc, item) => acc + (item.unidades || 0), 0),
    totalPrecio: items.reduce((acc, item) => acc + ((item.precio || 0) * (item.unidades || 0)), 0),
    finalizarCompraYActualizarStock: vi.fn().mockResolvedValue({ exito: true }),
    toastMessage: null,
    clearToast: vi.fn()
  };

  return render(<Carrito />, { cartContext: mockCartContext });
};


describe('Componente Carrito', () => {

  test('debe mostrar "Tu carrito está vacío" cuando no hay items', () => {
    renderCarritoConItems([]); // Renderiza con carrito vacío explícitamente
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  const finalizarButton = screen.getByRole('button', { name: /Finalizar Compra/i });
  expect(finalizarButton).toHaveAttribute('aria-disabled', 'true');
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
    const mockEliminarDelCarrito = vi.fn();
    const mockCartContext = {
      carritoItems: [mockProducto1],
      eliminarDelCarrito: mockEliminarDelCarrito,
      totalItems: 1,
      totalPrecio: mockProducto1.precio * mockProducto1.unidades
    };

    render(<Carrito />, { cartContext: mockCartContext });
    
    expect(screen.getByText(mockProducto1.nombre)).toBeInTheDocument();
    
    const botonEliminar = screen.getByRole('button', { name: '🗑️' });
    fireEvent.click(botonEliminar);

    expect(mockEliminarDelCarrito).toHaveBeenCalledWith(mockProducto1.codigo);
  });
  
  test('debe llamar a vaciarCarrito al hacer clic', () => {
    const mockVaciarCarrito = vi.fn();
    const mockCartContext = {
      carritoItems: [mockProducto1, mockProducto2],
      vaciarCarrito: mockVaciarCarrito,
      totalItems: 3,
      totalPrecio: mockProducto1.precio * mockProducto1.unidades + mockProducto2.precio * mockProducto2.unidades
    };

    render(<Carrito />, { cartContext: mockCartContext });

    expect(screen.getByText(mockProducto1.nombre)).toBeInTheDocument();

    const botonVaciar = screen.getByRole('button', { name: /Vaciar Carrito/i });
    fireEvent.click(botonVaciar);

    expect(mockVaciarCarrito).toHaveBeenCalled();
  });

  test('debe permitir finalizar compra cuando hay items', async () => {
    const mockFinalizarCompra = vi.fn().mockResolvedValue({ exito: true });
    const mockCartContext = {
      carritoItems: [mockProducto1],
      finalizarCompraYActualizarStock: mockFinalizarCompra,
      totalItems: 2,
      totalPrecio: mockProducto1.precio * mockProducto1.unidades
    };

    render(<Carrito />, { cartContext: mockCartContext });
    
  const botonFinalizar = screen.getByRole('button', { name: /Finalizar Compra/i });
  expect(botonFinalizar).not.toHaveAttribute('aria-disabled');
  expect(botonFinalizar).toHaveAttribute('href', '/checkout');
  });

});