import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../context/AuthProvider';
import { CartProvider } from '../../context/CartProvider';
import Carrito from '../../pages/Carrito';
// Mock productos para pruebas
const mockProductos = [
  {
    codigo: "JDM001",
    nombre: "Catan",
    categoria: "Juegos de Mesa",
    precio: 29990,
    stock: 10
  },
  {
    codigo: "JDM002",
    nombre: "Monopoly",
    categoria: "Juegos de Mesa",
    precio: 24990,
    stock: 15
  }
];

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Flujo de Checkout', () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            {component}
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('flujo completo de checkout con usuario autenticado', async () => {
    // Setup inicial - usuario autenticado
    const mockUser = { id: 1, email: 'test@test.com', nombre: 'Test User' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Setup carrito
    const mockCart = [
      { ...mockProductos[0], cantidad: 2 },
      { ...mockProductos[1], cantidad: 1 }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCart));

    renderWithProviders(<Carrito />);

    // Verificar que los productos están en el carrito
    await waitFor(() => {
      expect(screen.getByText(mockProductos[0].nombre)).toBeInTheDocument();
      expect(screen.getByText(mockProductos[1].nombre)).toBeInTheDocument();
    });

    // Verificar total
    const total = mockCart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    expect(screen.getByText(new RegExp(`\\$${total.toLocaleString()}`))).toBeInTheDocument();

    // Proceder al checkout
    const checkoutButton = screen.getByText(/Finalizar compra/i);
    fireEvent.click(checkoutButton);

    // Verificar redirección
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmacion-orden');
    });
  });

  test('impide checkout si el carrito está vacío', async () => {
    renderWithProviders(<Carrito />);
    
    const checkoutButton = screen.getByText(/Finalizar compra/i);
    expect(checkoutButton).toBeDisabled();
  });

  test('requiere autenticación para checkout', async () => {
    // Setup carrito con productos
    const mockCart = [{ ...mockProductos[0], cantidad: 1 }];
    localStorage.setItem('cart', JSON.stringify(mockCart));

    renderWithProviders(<Carrito />);

    const checkoutButton = screen.getByText(/Finalizar compra/i);
    fireEvent.click(checkoutButton);

    // Debería redirigir a login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});