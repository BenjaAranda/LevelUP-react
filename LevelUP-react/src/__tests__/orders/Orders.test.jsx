import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../context/AuthProvider';
import GestionOrdenes from '../../pages/GestionOrdenesNuevo';
// Mock de órdenes para pruebas
const mockOrdenes = [
  {
    id: "ORD001",
    fecha: "2023-10-26",
    cliente: {
      nombre: "Usuario Test",
      email: "test@test.com"
    },
    productos: [
      {
        nombre: "Catan",
        cantidad: 1,
        precio: 29990
      }
    ],
    estado: "Pendiente",
    total: 29990
  },
  {
    id: "ORD002",
    fecha: "2023-10-26",
    cliente: {
      nombre: "Usuario Test 2",
      email: "test2@test.com"
    },
    productos: [
      {
        nombre: "Monopoly",
        cantidad: 2,
        precio: 24990
      }
    ],
    estado: "Enviado",
    total: 49980
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

describe('Gestión de Órdenes', () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Setup admin user
    const mockAdmin = { 
      id: 1, 
      email: 'admin@test.com', 
      nombre: 'Admin User',
      isAdmin: true 
    };
    localStorage.setItem('user', JSON.stringify(mockAdmin));
  });

  test('lista todas las órdenes correctamente', async () => {
    renderWithProviders(<GestionOrdenes />);

    // Verificar que se muestran todas las órdenes
    await waitFor(() => {
      mockOrdenes.forEach(orden => {
        // Verificar ID
        expect(screen.getByText(orden.id)).toBeInTheDocument();
        
        // Verificar estado en el select
        const selectEstado = screen.getAllByRole('combobox').find(select => 
          Array.from(select.options).some(option => option.selected && option.value === orden.estado)
        );
        expect(selectEstado).toBeTruthy();
      });
    });
  });

  test('permite actualizar el estado de una orden', async () => {
    renderWithProviders(<GestionOrdenes />);

    // Seleccionar la primera orden
    const primeraOrden = mockOrdenes[0];
    const estadoSelect = screen.getAllByRole('combobox')[0];
    
    // Cambiar estado
    fireEvent.change(estadoSelect, { target: { value: 'Enviado' } });

    // Verificar que la orden está actualizada en el estado del componente
    await waitFor(() => {
      const ordenes = screen.getAllByRole('row');
      const primerOrden = ordenes[1]; // 0 es el header
      expect(primerOrden).toHaveTextContent('Enviado');
    });
  });

  test('filtra órdenes por estado', async () => {
    renderWithProviders(<GestionOrdenes />);

    // Seleccionar filtro "Pendiente"
    const filtroSelect = screen.getByLabelText(/Filtrar por estado/i);
    fireEvent.change(filtroSelect, { target: { value: 'Pendiente' } });

    // Verificar que solo se muestran órdenes pendientes
    await waitFor(() => {
      const ordenesPendientes = mockOrdenes.filter(o => o.estado === 'Pendiente');
      ordenesPendientes.forEach(orden => {
        expect(screen.getByText(new RegExp(orden.id))).toBeInTheDocument();
      });
      
      const ordenesNoPendientes = mockOrdenes.filter(o => o.estado !== 'Pendiente');
      ordenesNoPendientes.forEach(orden => {
        expect(screen.queryByText(new RegExp(orden.id))).not.toBeInTheDocument();
      });
    });
  });

  test('muestra detalles de una orden específica', async () => {
    renderWithProviders(<GestionOrdenes />);

    // Click en ver detalles de la primera orden
    const verDetallesBtn = screen.getAllByText(/Ver detalles/i)[0];
    fireEvent.click(verDetallesBtn);

    // Verificar que se muestran los detalles en el modal
    const primeraOrden = mockOrdenes[0];
    await waitFor(() => {
      const nombre = screen.getByText(new RegExp(`Nombre: ${primeraOrden.cliente.nombre}`));
      const email = screen.getByText(new RegExp(`Email: ${primeraOrden.cliente.email}`));
      expect(nombre).toBeInTheDocument();
      expect(email).toBeInTheDocument();
    });
  });
});