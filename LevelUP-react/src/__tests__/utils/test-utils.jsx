// En: src/__tests__/utils/test-utils.jsx

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { vi } from 'vitest';

const defaultCartContext = {
  carritoItems: [],
  agregarAlCarrito: vi.fn(),
  restarDelCarrito: vi.fn(),
  eliminarDelCarrito: vi.fn(),
  vaciarCarrito: vi.fn(),
  totalItems: 0,
  totalPrecio: 0,
  finalizarCompraYActualizarStock: vi.fn().mockResolvedValue({ exito: true }),
  toastMessage: null,
  clearToast: vi.fn()
};

// Función de "render" personalizada que envuelve todo en los Providers
function renderWithProviders(
  ui,
  {
    cartContext = defaultCartContext,
    // Opciones adicionales si las necesitas
    ...renderOptions
  } = {}
) {
  // Componente Wrapper que agrupa todos los providers
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <CartContext.Provider value={cartContext}>
            {children}
          </CartContext.Provider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  // Renderiza el UI envuelto en el Wrapper
  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    cartContext // Exponemos el contexto para que los tests puedan verificar que se llamaron las funciones
  };
}

// Re-exportamos todo desde @testing-library/react
export * from '@testing-library/react';
// Sobrescribimos el 'render' original con nuestra versión personalizada
export { renderWithProviders as render };