// En: src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Importamos el componente y los datos
import ProductCard from '../components/ProductCard.jsx';
import { productos } from '../data/productos.js';

const Home = () => {
  
  // 2. Usamos el estado para guardar la lista de productos
  const [productosDestacados, setProductosDestacados] = useState([]);

  // 3. Usamos useEffect para cargar los datos cuando el componente se monta
  useEffect(() => {
    // Aquí podrías filtrar solo los "destacados", 
    // pero por ahora cargaremos todos los productos de la BD
    setProductosDestacados(productos);
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // Función placeholder para el carrito
  const handleAgregarAlCarrito = (producto) => {
    alert(`Agregando ${producto.nombre} al carrito... (próximamente!)`);
    // Aquí es donde llamarías a la función de tu CartContext
  };

  return (
    <>
      {/* --- Banner --- (Esta sección queda igual) */}
      <section className="banner">
        <img src="/img_index/banner.png" alt="Promoción Gamer" />
        <div className="banner-text">
          <h2>Equipamiento Gamer</h2>
          <p>Consolas, PCs, Sillas y más 🚀</p>
          <Link to="/productos" className="btn">¡Explorar ahora!</Link>
        </div>
      </section>

      {/* --- Sección de categorías --- (Esta sección queda igual) */}
      <section className="categorias">
        <div className="categoria">
          <img src="/img_productos/catan.png" alt="Juegos de Mesa" />
          <h3>Juegos de Mesa</h3>
          <Link to="/productos?categoria=Juegos%20de%20Mesa">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/img_index/accesorios.png" alt="Accesorios" />
          <h3>Accesorios</h3>
          <Link to="/productos?categoria=Accesorios">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/img_index/CONSOLAS.png" alt="Consolas" />
          <h3>Consolas</h3>
          <Link to="/productos?categoria=Consolas">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/img_index/PC1.png" alt="Computadores Gamers" />
          <h3>Computadores Gamers</h3>
          <Link to="/productos?categoria=Computadores%20Gamers">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/img_index/Silla_gamer.png" alt="Sillas Gamers" />
          <h3>Sillas Gamers</h3>
          <Link to="/productos?categoria=Sillas%20Gamers">Ver categoría →</Link>
        </div>
      </section>

      {/* --- Productos destacados --- (Esta sección está actualizada) */}
      <section className="productos">
        <h2 className="titulo-seccion">PRODUCTOS DESTACADOS</h2>
        <div className="grid-productos">
          
          {/* 4. Mapeamos los datos y usamos el componente reutilizable */}
          {productosDestacados.map((prod) => (
            <ProductCard 
              key={prod.codigo} 
              producto={prod} 
              onAgregarAlCarrito={handleAgregarAlCarrito}
            />
          ))}

        </div>
      </section>
    </>
  );
};

export default Home;