import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { CartProvider } from '../context/CartProvider'
import App from '../App'

describe('Componente App (Layout Principal)', () => {
  test('debe renderizar el Navbar y el Footer', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Verifica que el navbar existe
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header.querySelector('nav')).toBeInTheDocument()

    // Verifica que el contenido principal existe
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()

    // Verifica que el footer existe
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})