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
    cart, 
    addToCart, 
    removeOne,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount
  } = useCart()

  return (
    <div>
      <button onClick={() => addToCart(productoTest)}>
        Agregar al carrito
      </button>
      
      {cart.map(item => (
        <div key={item.codigo} data-testid="item-carrito">
          <span>{item.nombre} x{item.cantidad}</span>
          <button onClick={() => removeOne(item.codigo)}>
            Quitar uno
          </button>
          <button onClick={() => removeFromCart(item.codigo)}>
            Eliminar
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <div>Total items: {totalItems}</div>
          <div>Total precio: ${totalAmount}</div>
          <button onClick={clearCart}>Vaciar carrito</button>
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
      const cartSaved = JSON.parse(localStorage.getItem('cart'))
      expect(cartSaved).toHaveLength(1)
      expect(cartSaved[0]).toMatchObject({
        codigo: 'TEST001',
        nombre: 'Producto Test',
        cantidad: 1
      })
    })
  })

  test('restaura el carrito desde localStorage', async () => {
    // Simula carrito guardado
    const cartSaved = [{
      ...productoTest,
      cantidad: 2
    }]
    localStorage.setItem('cart', JSON.stringify(cartSaved))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('item-carrito')
      expect(items).toHaveLength(1)
      expect(screen.getByText('Total items: 2')).toBeInTheDocument()
      expect(screen.getByText('Total precio: $2000')).toBeInTheDocument()
    })
  })
})