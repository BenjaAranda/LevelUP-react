// En: src/components/__tests__/ProductCard.test.jsx

import React from 'react';
import { describe, test, expect, vi, afterEach } from 'vitest';
// Usamos el render de test-utils
import { render, screen, fireEvent } from '../utils/test-utils.jsx';
import '@testing-library/jest-dom';
// Corregimos la ruta al componente
import ProductCard from '../../components/ProductCard.jsx'; 

// Datos de prueba (ejemplo)
const mockProduct = {
  codigo: "TEST001",
  img: '/test-image.png',
  nombre: 'Producto de Prueba',
  categoria: 'Test Categoria',
  precio: 10000,
  stock: 5,
  descripcion: "Descripción de prueba."
};

const mockProductAgotado = {
    ...mockProduct,
    stock: 0,
    codigo: "TEST002"
};

const mockOnAgregarAlCarrito = vi.fn();

describe('Componente ProductCard', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar correctamente la información del producto', () => {
    render(
      <ProductCard
        producto={mockProduct}
        onAgregarAlCarrito={mockOnAgregarAlCarrito}
      />
    );

    expect(screen.getByAltText('Producto de Prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Producto de Prueba' })).toBeInTheDocument();
    
    // --- CORRECCIÓN ---
    // Usamos una función (Text Matcher) para encontrar el texto 
    // aunque esté dividido en nodos <strong> y de texto.
    expect(screen.getByText((content, element) => 
      element.tagName.toLowerCase() === 'p' && 
      element.textContent.includes('Categoría: Test Categoria')
    )).toBeInTheDocument();
    // --- FIN CORRECCIÓN ---

    // Asegurarse que el formato de precio coincida
    expect(screen.getByText('$10.000 CLP')).toBeInTheDocument(); 
    expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar al carrito/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver detalle/i })).toBeInTheDocument();
  });

  test('debe llamar a onAgregarAlCarrito al hacer clic en el botón', () => {
    render(
       <ProductCard
         producto={mockProduct}
         onAgregarAlCarrito={mockOnAgregarAlCarrito}
       />
    );

    const botonAgregar = screen.getByRole('button', { name: /Agregar al carrito/i });
    fireEvent.click(botonAgregar);

    expect(mockOnAgregarAlCarrito).toHaveBeenCalledTimes(1);
    expect(mockOnAgregarAlCarrito).toHaveBeenCalledWith(mockProduct);
  });

   test('debe mostrar "AGOTADO" y deshabilitar el botón si stock es 0', () => {
    render(
       <ProductCard
         producto={mockProductAgotado}
         onAgregarAlCarrito={mockOnAgregarAlCarrito}
       />
    );

    expect(screen.getByText('AGOTADO')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agotado/i })).toBeDisabled();
    const productDiv = screen.getByText('AGOTADO').closest('.producto'); 
    expect(productDiv).toHaveClass('agotado');
  });

});