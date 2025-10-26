import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../context/AuthProvider'
import { useAuth } from '../../hooks/useAuth'
import { MemoryRouter } from 'react-router-dom'

// Componente de prueba que usa el hook useAuth
const TestComponent = () => {
  const { usuario, login, logout } = useAuth()
  return (
    <div>
      {usuario ? (
        <>
          <span>Bienvenido {usuario.nombre}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <button
          onClick={() => login({ 
            nombre: 'Usuario Test', 
            email: 'test@test.com',
            isAdmin: false 
          })}
        >
          Iniciar sesión
        </button>
      )}
    </div>
  )
}

describe('Autenticación', () => {
  // Limpiamos localStorage antes de cada test
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('useAuth hook maneja login/logout correctamente', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    )

    // Inicialmente no hay usuario
    expect(screen.queryByText(/Bienvenido/)).not.toBeInTheDocument()
    
    // Click en login
    fireEvent.click(screen.getByText('Iniciar sesión'))
    
    // Espera a que aparezca el mensaje de bienvenida
    await waitFor(() => {
      expect(screen.getByText('Bienvenido Usuario Test')).toBeInTheDocument()
    })
    
    // Verifica que se guardó en localStorage
    expect(JSON.parse(localStorage.getItem('usuarioActivo'))).toEqual({
      nombre: 'Usuario Test',
      email: 'test@test.com',
      isAdmin: false
    })
    
    // Click en logout
    fireEvent.click(screen.getByText('Cerrar sesión'))
    
    // Verifica que volvió al estado inicial
    expect(screen.queryByText(/Bienvenido/)).not.toBeInTheDocument()
    expect(localStorage.getItem('usuarioActivo')).toBeNull()
  })

  test('AuthProvider restaura sesión desde localStorage', async () => {
    // Simula usuario previamente logueado
    const usuarioGuardado = {
      nombre: 'Usuario Guardado',
      email: 'guardado@test.com',
      isAdmin: false
    }
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioGuardado))

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    )

    // Debe mostrar el usuario restaurado
    await waitFor(() => {
      expect(screen.getByText('Bienvenido Usuario Guardado')).toBeInTheDocument()
    })
  })

  test('maneja error en localStorage correctamente', async () => {
    // Simula datos corruptos en localStorage
    localStorage.setItem('usuarioActivo', 'datos inválidos')

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    )

    // No debe haber usuario activo y localStorage debe limpiarse
    expect(screen.queryByText(/Bienvenido/)).not.toBeInTheDocument()
    await waitFor(() => {
      expect(localStorage.getItem('usuarioActivo')).toBeNull()
    })
  })
})