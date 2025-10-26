import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '../../context/CartProvider'
import { useCart } from '../../hooks/useCart'

// Producto de prueba
const productoTest = {
  codigo: 'TEST001',
  nombre: 'Producto Test',
  precio: 1000,
  descripcion: 'Producto para testing',
  imagen: '/test.jpg'
}

// Componente de prueba que usa useCart
const TestComponent = () => {
  const { 
    carritoItems, 
    agregarAlCarrito, 
    restarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPrecio
  } = useCart()

  return (
    <div>
      <button onClick={() => agregarAlCarrito(productoTest)}>
        Agregar al carrito
      </button>
      
      {carritoItems.map(item => (
        <div key={item.codigo} data-testid="item-carrito">
          <span>{item.nombre} x{item.unidades}</span>
          <button onClick={() => restarDelCarrito(item.codigo)}>
            Quitar uno
          </button>
          <button onClick={() => eliminarDelCarrito(item.codigo)}>
            Eliminar
          </button>
        </div>
      ))}

      {carritoItems.length > 0 && (
        <>
          <div>Total items: {totalItems}</div>
          <div>Total precio: ${totalPrecio}</div>
          <button onClick={vaciarCarrito}>Vaciar carrito</button>
        </>
      )}
    </div>
  )
}

describe('Carrito de compras', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('agrega productos al carrito correctamente', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    // Agrega un producto
    fireEvent.click(screen.getByText('Agregar al carrito'))

    await waitFor(() => {
      const items = screen.getAllByTestId('item-carrito')
      expect(items).toHaveLength(1)
      expect(screen.getByText('Producto Test x1')).toBeInTheDocument()
      expect(screen.getByText('Total items: 1')).toBeInTheDocument()
      expect(screen.getByText('Total precio: $1000')).toBeInTheDocument()
    })

    // Agrega el mismo producto otra vez
    fireEvent.click(screen.getByText('Agregar al carrito'))

    await waitFor(() => {
      expect(screen.getByText('Producto Test x2')).toBeInTheDocument()
      expect(screen.getByText('Total items: 2')).toBeInTheDocument()
      expect(screen.getByText('Total precio: $2000')).toBeInTheDocument()
    })
  })

  test('resta y elimina productos del carrito', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    // Agrega dos unidades
    fireEvent.click(screen.getByText('Agregar al carrito'))
    fireEvent.click(screen.getByText('Agregar al carrito'))

    // Verifica estado inicial
    await waitFor(() => {
      expect(screen.getByText('Producto Test x2')).toBeInTheDocument()
    })

    // Resta una unidad
    fireEvent.click(screen.getByText('Quitar uno'))

    await waitFor(() => {
      expect(screen.getByText('Producto Test x1')).toBeInTheDocument()
      expect(screen.getByText('Total items: 1')).toBeInTheDocument()
      expect(screen.getByText('Total precio: $1000')).toBeInTheDocument()
    })

    // Elimina el producto
    fireEvent.click(screen.getByText('Eliminar'))

    await waitFor(() => {
      expect(screen.queryByTestId('item-carrito')).not.toBeInTheDocument()
    })
  })

  test('vacía el carrito completamente', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    // Agrega productos
    fireEvent.click(screen.getByText('Agregar al carrito'))
    fireEvent.click(screen.getByText('Agregar al carrito'))

    // Verifica que hay productos
    await waitFor(() => {
      expect(screen.getByTestId('item-carrito')).toBeInTheDocument()
    })

    // Vacía el carrito
    fireEvent.click(screen.getByText('Vaciar carrito'))

    // Verifica que no hay productos
    await waitFor(() => {
      expect(screen.queryByTestId('item-carrito')).not.toBeInTheDocument()
    })
  })

  test('persiste el carrito en localStorage', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    // Agrega un producto
    fireEvent.click(screen.getByText('Agregar al carrito'))

    await waitFor(() => {
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito'))
      expect(carritoGuardado).toHaveLength(1)
      expect(carritoGuardado[0]).toMatchObject({
        codigo: 'TEST001',
        nombre: 'Producto Test',
        unidades: 1
      })
    })
  })

  test('restaura el carrito desde localStorage', async () => {
    // Simula carrito guardado
    const carritoGuardado = [{
      ...productoTest,
      unidades: 2
    }]
    localStorage.setItem('carrito', JSON.stringify(carritoGuardado))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto Test x2')).toBeInTheDocument()
      expect(screen.getByText('Total items: 2')).toBeInTheDocument()
      expect(screen.getByText('Total precio: $2000')).toBeInTheDocument()
    })
  })
})