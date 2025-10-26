import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import { CartProvider } from '../../context/CartProvider'

describe('ProductCard', () => {
  const mockProduct = {
    codigo: 'PROD001',
    nombre: 'Producto Test',
    precio: 1000,
    descripcion: 'Descripción de prueba',
    imagen: '/test.jpg',
    stock: 5
  }

  const mockOnAgregarAlCarrito = vi.fn()

  const renderCard = () => {
    return render(
      <MemoryRouter>
        <CartProvider>
          <ProductCard 
          producto={mockProduct}
          onAgregarAlCarrito={mockOnAgregarAlCarrito}
          />
        </CartProvider>
      </MemoryRouter>
    )
  }

  test('renderiza información del producto correctamente', () => {
    renderCard()

    expect(screen.getByText(mockProduct.nombre)).toBeInTheDocument()
    // Precio formateado según la localización puede incluir separadores de miles
    expect(screen.getByText(/1\.000|1000/)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.imagen)
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockProduct.nombre)
  })

  test('llama callback al agregar al carrito', () => {
    renderCard()

    fireEvent.click(screen.getByText(/Agregar al carrito/i))
    expect(mockOnAgregarAlCarrito).toHaveBeenCalledWith(mockProduct)
  })

  test('tiene link al detalle del producto', () => {
    renderCard()

    const detalleLink = screen.getByText(/Ver detalle/i)
    expect(detalleLink).toHaveAttribute('href', `/producto/${mockProduct.codigo}`)
  })
})