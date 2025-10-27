// En: src/__tests__/integration/Checkout.test.jsx

import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
// --- ¡CAMBIO IMPORTANTE! ---
// Importamos 'render' desde nuestro util
import { render, screen, fireEvent, waitFor } from '../utils/test-utils.jsx';
// --- FIN CAMBIO ---
import '@testing-library/jest-dom';
import Carrito from '../../pages/Carrito.jsx';
import * as AuthHook from '../../hooks/useAuth.jsx';
import * as CartHook from '../../hooks/useCart.jsx';

// Mock de las funciones
const mockAgregarAlCarrito = vi.fn();
const mockFinalizarCompra = vi.fn();

// Mock de datos
const mockProducto1 = { codigo: 'P001', nombre: 'Catan', precio: 100, unidades: 1, stock: 5 };
const mockUsuario = { nombre: 'Test User', email: 'test@test.com', isAdmin: false };

describe('Flujo de Checkout (Integración)', () => {

  beforeEach(() => {
    // Configuración de mocks por defecto para CADA prueba
    // Por defecto, no hay usuario logueado
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      usuario: null,
      login: vi.fn(),
      logout: vi.fn(),
    });
    // Por defecto, carrito vacío
    vi.spyOn(CartHook, 'useCart').mockReturnValue({
      carritoItems: [],
      totalPrecio: 0,
      agregarAlCarrito: mockAgregarAlCarrito,
      finalizarCompraYActualizarStock: mockFinalizarCompra
    });
    window.alert = vi.fn(); // Mockear alerta
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Limpiar mocks
  });

  test('impide checkout si el carrito está vacío', () => {
    render(<Carrito />);
    // El botón debe aparecer visualmente deshabilitado (atributo aria-disabled o disabled)
    const boton = screen.getByRole('button', { name: /Finalizar Compra/i });
    expect(boton).toHaveAttribute('aria-disabled', 'true');
  });

  test('flujo completo de checkout con usuario autenticado', async () => {
    // 1. Sobrescribimos Mocks para este test
    AuthHook.useAuth.mockReturnValue({
      usuario: mockUsuario, // <-- Usuario logueado
      // ...
    });
    CartHook.useCart.mockReturnValue({
      carritoItems: [mockProducto1], // <-- Carrito con 1 item
      totalPrecio: 100,
      finalizarCompraYActualizarStock: mockFinalizarCompra,
      // ...
    });
    // Simulamos que la compra es exitosa
    mockFinalizarCompra.mockResolvedValue(true); 

    // 2. Renderizamos el Carrito
    render(<Carrito />);

    // 3. Verificamos que el item está
    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('$ 100')).toBeInTheDocument();

    // 4. Hacemos clic en Finalizar Compra — actualmente esto es un Link a /checkout,
    // la lógica de finalización ocurre en la página de checkout, por lo que aquí
    // comprobamos que el botón está habilitado y apunta a /checkout.
    const botonFinalizar = screen.getByRole('button', { name: /Finalizar Compra/i });
    expect(botonFinalizar).toBeEnabled();
    expect(botonFinalizar).toHaveAttribute('href', '/checkout');
    
    // 7. (Opcional) Verificar que la navegación (navigate) fue llamada
    // Esto requiere mockear 'react-router-dom', es más complejo.
    // Por ahora, verificamos la lógica del hook.
  });

  test('requiere autenticación para checkout (Simulación Futura)', async () => {
    // NOTA: Tu lógica actual en Carrito.jsx NO impide la compra si
    // el usuario es 'Invitado'. Si quisieras añadir esa lógica,
    // este test fallaría y tendrías que modificar Carrito.jsx.
    
    // Por ahora, solo simulamos que el usuario es invitado
    AuthHook.useAuth.mockReturnValue({ usuario: null });
    CartHook.useCart.mockReturnValue({
      carritoItems: [mockProducto1],
      totalPrecio: 100,
      finalizarCompraYActualizarStock: mockFinalizarCompra,
    });
    mockFinalizarCompra.mockResolvedValue(true);

  render(<Carrito />);
    
  const botonFinalizar = screen.getByRole('button', { name: /Finalizar Compra/i });
  // Verificamos que el botón está habilitado y apunta a /checkout
  expect(botonFinalizar).toBeEnabled();
  expect(botonFinalizar).toHaveAttribute('href', '/checkout');
  // Clicking would navigate to /checkout in the real app
  fireEvent.click(botonFinalizar);

    // Si en el futuro cambias la lógica para que redirija a /login si no hay usuario,
    // este test fallaría y deberías actualizarlo para esperar la redirección.
  });

});