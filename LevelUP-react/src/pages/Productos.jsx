// En: src/pages/Productos.jsx

import React, { useState, useEffect } from 'react';
// Importamos los estilos específicos de esta página
import '../styles/productos.css'; 

// --- Datos de ejemplo (reemplazarían tu .js o una API) ---
const mockProductos = [
  { id: 1, nombre: 'Silla Gamer Pro', precio: 150000, categoria: 'Sillas Gamers', img: 'https://via.placeholder.com/150' },
  { id: 2, nombre: 'Mouse Logitech', precio: 45000, categoria: 'Mouse', img: 'https://via.placeholder.com/150' },
  { id: 3, nombre: 'Consola PS5', precio: 550000, categoria: 'Consolas', img: 'https://via.placeholder.com/150' },
  { id: 4, nombre: 'PC Gamer Nitro', precio: 1200000, categoria: 'Computadores Gamers', img: 'https://via.placeholder.com/150' },
  { id: 5, nombre: 'Catan', precio: 35000, categoria: 'Juegos de Mesa', img: 'https://via.placeholder.com/150' },
];
// --- Fin de datos de ejemplo ---


// --- Componente para una tarjeta de producto (para ordenar el código) ---
const ProductCard = ({ producto }) => (
  <div className="product-card"> {/* Asegúrate de tener esta clase en tu CSS */}
    <img src={producto.img} alt={producto.nombre} />
    <h4>{producto.nombre}</h4>
    <p>${producto.precio.toLocaleString('es-CL')}</p>
    <button className="btn-carrito">Agregar al Carrito</button>
  </div>
);


// --- Componente Principal de la Página ---
const Productos = () => {
  // Estados para manejar los filtros (reemplaza a JS)
  const [orden, setOrden] = useState('default');
  const [categoria, setCategoria] = useState('todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(2000000);

  // Estados para manejar los productos
  const [productos, setProductos] = useState([]);

  // useEffect se ejecuta 1 vez (al cargar) para "obtener" los productos
  useEffect(() => {
    // Aquí es donde llamarías a tu API o cargarías tus datos
    // Por ahora, usamos los datos de ejemplo (mockProductos)
    setProductos(mockProductos);
  }, []); // El [] vacío significa que solo se ejecuta al montar

  // Lógica de filtrado (aún por implementar, pero lista)
  const handleFiltrar = () => {
    console.log("Filtrando con:", { orden, categoria, precioMin, precioMax });
    // Aquí pondrías la lógica para filtrar el array 'productos'
  };

  return (
    // Ya no usamos <main>, usamos un div con la misma clase
    // El <main> principal está en App.jsx
    <div className="productos-page">
      
      {/* --- Filtros --- */}
      <aside className="filtros">
        <h3>Filtros</h3>

        {/* Ordenar */}
        <label htmlFor="ordenar">Ordenar</label>
        <select 
          id="ordenar" 
          value={orden} 
          onChange={(e) => setOrden(e.target.value)}
        >
          <option value="default">Por defecto</option>
          <option value="precioMayor">Mayor precio</option>
          <option value="precioMenor">Menor precio</option>
          <option value="a-z">A - Z</option>
          <option value="z-a">Z - A</option>
        </select>

        {/* Categoría */}
        <label htmlFor="categoria-filtro">Categoría</label>
        {/* OJO: Cambié el id a "categoria-filtro" porque "categoria" ya
            lo usa el <select> del header (AppNavbar.jsx) y los id deben ser únicos */}
        <select 
          id="categoria-filtro" 
          value={categoria} 
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="Juegos de Mesa">Juegos de Mesa</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Consolas">Consolas</option>
          <option value="Computadores Gamers">Computadores Gamers</option>
          <option value="Sillas Gamers">Sillas Gamers</option>
          <option value="Mouse">Mouse</option>
          <option value="Mousepad">Mousepad</option>
          <option value="Poleras Personalizadas">Poleras Personalizadas</option>
          <option value="Polerones Gamers Personalizados">Polerones Gamers Personalizados</option>
        </select>

        {/* Rango de precio */}
        <label htmlFor="precioMin">Precio mínimo</label>
        <input 
          type="number" 
          id="precioMin" 
          value={precioMin} 
          onChange={(e) => setPrecioMin(e.target.value)} 
        />
        <label htmlFor="precioMax">Precio máximo</label>
        <input 
          type="number" 
          id="precioMax" 
          value={precioMax} 
          onChange={(e) => setPrecioMax(e.target.value)} 
        />

        {/* Botón filtrar */}
        <button id="btnFiltrar" className="btn-carrito" onClick={handleFiltrar}>
          Filtrar
        </button>
      </aside>

      {/* --- Lista de productos --- */}
      <section className="lista-productos" id="listaProductos">
        {/* Aquí renderizamos los productos del estado con .map() */}
        {productos.map(prod => (
          <ProductCard key={prod.id} producto={prod} />
        ))}
      </section>
    </div>
  );
};

export default Productos;