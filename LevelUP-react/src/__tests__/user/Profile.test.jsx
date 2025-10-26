import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../context/AuthProvider';
import Perfil from '../../pages/Perfil';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Perfil de Usuario', () => {
  const mockUser = {
    id: 1,
    email: 'user@test.com',
    nombre: 'Test User',
    direccion: 'Calle Test 123',
    telefono: '123456789'
  };

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
    localStorage.setItem('user', JSON.stringify(mockUser));
  });

  test('muestra información actual del usuario', async () => {
    renderWithProviders(<Perfil />);

    await waitFor(() => {
      const nombreInput = screen.getByTestId('nombre-input');
      const emailInput = screen.getByTestId('email-input');
      const direccionInput = screen.getByTestId('direccion-input');
      const telefonoInput = screen.getByTestId('telefono-input');
      
      expect(nombreInput.value).toBe(mockUser.nombre);
      expect(emailInput.value).toBe(mockUser.email);
      expect(direccionInput.value).toBe(mockUser.direccion);
      expect(telefonoInput.value).toBe(mockUser.telefono);
    });
  });

  test('permite actualizar información del perfil', async () => {
    renderWithProviders(<Perfil />);

    // Modificar campos
    const nombreInput = screen.getByTestId('nombre-input');
    const direccionInput = screen.getByTestId('direccion-input');
    const telefonoInput = screen.getByTestId('telefono-input');

    fireEvent.change(nombreInput, { target: { value: 'Nuevo Nombre' } });
    fireEvent.change(direccionInput, { target: { value: 'Nueva Dirección' } });
    fireEvent.change(telefonoInput, { target: { value: '987654321' } });

    // Guardar cambios
    const guardarBtn = screen.getByText(/Guardar cambios/i);
    fireEvent.click(guardarBtn);

    // Verificar actualización en localStorage
    await waitFor(() => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      expect(updatedUser.nombre).toBe('Nuevo Nombre');
      expect(updatedUser.direccion).toBe('Nueva Dirección');
      expect(updatedUser.telefono).toBe('987654321');
    });
  });

  test('valida campos requeridos', async () => {
    renderWithProviders(<Perfil />);

    // Limpiar campos requeridos
    const nombreInput = screen.getByTestId('nombre-input');
    const emailInput = screen.getByTestId('email-input');

    fireEvent.change(nombreInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });

    // Intentar guardar
    const guardarBtn = screen.getByText(/Guardar cambios/i);
    fireEvent.click(guardarBtn);

    // Verificar mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/El nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/El email es requerido/i)).toBeInTheDocument();
    });
  });

  test('valida formato de email', async () => {
    renderWithProviders(<Perfil />);

    // Ingresar email inválido
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });

    // Intentar guardar
    const guardarBtn = screen.getByText(/Guardar cambios/i);
    fireEvent.click(guardarBtn);

    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
    });
  });

  test('permite cambiar contraseña', async () => {
    renderWithProviders(<Perfil />);

    // Mostrar formulario de cambio de contraseña
    const cambiarPassBtn = screen.getByText(/Cambiar contraseña/i);
    fireEvent.click(cambiarPassBtn);

    // Llenar formulario
    const actualPassInput = screen.getByLabelText(/Contraseña actual/i);
    const nuevaPassInput = screen.getByLabelText(/Nueva contraseña/i);
    const confirmarPassInput = screen.getByLabelText(/Confirmar contraseña/i);

    fireEvent.change(actualPassInput, { target: { value: 'PassActual123' } });
    fireEvent.change(nuevaPassInput, { target: { value: 'NuevaPass123' } });
    fireEvent.change(confirmarPassInput, { target: { value: 'NuevaPass123' } });

    // Guardar cambios
    const guardarPassBtn = screen.getByText(/Actualizar contraseña/i);
    fireEvent.click(guardarPassBtn);

    // Verificar éxito
    await waitFor(() => {
      expect(screen.getByText(/Contraseña actualizada con éxito/i)).toBeInTheDocument();
    });
  });
});