// En: src/hooks/useCart.jsx

import { useContext } from 'react';
// 1. Importa el ÚNICO CartContext que creamos en la carpeta 'context'
import { CartContext } from '../context/CartContext.jsx'; 

// 2. Exporta el hook que usa ese contexto
export const useCart = () => {
  const context = useContext(CartContext); 
  if (!context) {
    // Este es el error que estabas viendo
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};