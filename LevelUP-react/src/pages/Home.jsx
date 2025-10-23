// En: src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Importamos el componente, los datos y el hook del carrito
import ProductCard from '../components/ProductCard.jsx';
import { productos } from '../data/productos.js';
import { useCart } from '../hooks/useCart.jsx';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  
  // 2. Traemos la función para agregar al carrito
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    // Por ahora, mostramos todos los productos como "destacados"
    setProductosDestacados(productos);
  }, []);

  // 3. Esta función se la pasaremos al ProductCard
  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    alert(`Agregado ${producto.nombre} al carrito!`); // Feedback simple
  };

  return (
    <>
      {/* --- Banner --- */}
      <section className="banner">
        <img src="/img_index/banner.png" alt="Promoción Gamer" />
        <div className="banner-text">
          <h2>Equipamiento Gamer</h2>
          <p>Consolas, PCs, Sillas y más 🚀</p>
          <Link to="/productos" className="btn">¡Explorar ahora!</Link>
        </div>
      </section>

      {/* --- Sección de categorías --- */}
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

      {/* --- Productos destacados --- */}
      <section className="productos">
        <h2 className="titulo-seccion">PRODUCTOS DESTACADOS</h2>
        <div className="grid-productos">
          
          {/* 4. Usamos el mismo ProductCard que la página de Productos */}
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