// En: src/hooks/useCart.jsx (Con Logs)

import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

// Hook personalizado que usa el contexto central en src/context/CartContext
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}