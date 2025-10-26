import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RutaProtegida from '../../components/RutaProtegida'
import { AuthProvider } from '../../context/AuthProvider'
import { AuthContext } from '../../context/AuthContext'

// Componente de prueba para las rutas protegidas
const ComponenteProtegido = () => <div>Contenido Protegido</div>
const ComponenteAdmin = () => <div>Panel Admin</div>

describe('RutaProtegida', () => {
  const renderWithRouter = (usuario = null) => {
    // Si se provee un usuario, lo guardamos en localStorage para que AuthProvider lo lea
    if (usuario) {
      localStorage.setItem('usuarioActivo', JSON.stringify(usuario))
    }

    return render(
      <MemoryRouter initialEntries={['/protegida']}>
        <AuthContext.Provider value={{ usuario }}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/protegida"
              element={
                <RutaProtegida>
                  <ComponenteProtegido />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin"
              element={
                <RutaProtegida requireAdmin={true}>
                  <ComponenteAdmin />
                </RutaProtegida>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('redirecciona a login si no hay usuario', async () => {
    renderWithRouter()
    
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  test('permite acceso a usuarios autenticados', async () => {
    const usuario = { 
      nombre: 'Usuario Normal',
      email: 'user@test.com',
      isAdmin: false
    }
    
    renderWithRouter(usuario)
    
    await waitFor(() => {
      expect(screen.getByText('Contenido Protegido')).toBeInTheDocument()
    })
  })

  test('restringe acceso a rutas admin para usuarios no admin', async () => {
    const usuario = { 
      nombre: 'Usuario Normal',
      email: 'user@test.com',
      isAdmin: false
    }
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider value={{ usuario }}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/admin"
              element={
                <RutaProtegida requireAdmin={true}>
                  <ComponenteAdmin />
                </RutaProtegida>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      // Para usuarios no-admin no debe mostrarse el panel admin
      expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument()
    })
  })

  test('permite acceso a rutas admin para usuarios admin', async () => {
    const adminUser = { 
      nombre: 'Admin',
      email: 'admin@test.com',
      isAdmin: true
    }
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider value={{ usuario: adminUser }}>
          <Routes>
            <Route
              path="/admin"
              element={
                <RutaProtegida requireAdmin={true}>
                  <ComponenteAdmin />
                </RutaProtegida>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Panel Admin')).toBeInTheDocument()
    })
  })
})