// En: src/__tests__/utils/test-utils.jsx

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider.jsx';
import { CartProvider } from '../../context/CartProvider.jsx';
// Función de "render" personalizada que envuelve todo en los Providers
function renderWithProviders(
  ui,
  {
    // Opciones adicionales si las necesitas (ej: pre-cargar estado)
    ...renderOptions
  } = {}
) {
  // Componente Wrapper que agrupa todos los providers
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  // Renderiza el UI envuelto en el Wrapper
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-exportamos todo desde @testing-library/react
export * from '@testing-library/react';
// Sobrescribimos el 'render' original con nuestra versión personalizada
export { renderWithProviders as render };