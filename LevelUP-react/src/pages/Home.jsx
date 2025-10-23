// En: src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard.jsx';
import { productos } from '../data/productos.js';
import { useCart } from '../hooks/useCart.jsx';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    // Usamos .slice(0, 8) para mostrar solo los primeros 8 productos como destacados
    setProductosDestacados(productos.slice(0, 8));
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    alert(`Agregado ${producto.nombre} al carrito!`);
  };

  return (
    <>
      {/* --- Banner --- */}
      <section className="banner">
        {/* CORREGIDO: Se quitó /img_index/ de la ruta */}
        <img src="/banner.png" alt="Promoción Gamer" />
        <div className="banner-text">
          <h2>Equipamiento Gamer</h2>
          <p>Consolas, PCs, Sillas y más 🚀</p>
          <Link to="/productos" className="btn">¡Explorar ahora!</Link>
        </div>
      </section>

      {/* --- Sección de categorías --- */}
      <section className="categorias">
        <div className="categoria">
          {/* CORREGIDO: Se quitó /img_productos/ de la ruta */}
          <img src="/catan.png" alt="Juegos de Mesa" />
          <h3>Juegos de Mesa</h3>
          <Link to="/productos?categoria=Juegos%20de%20Mesa">Ver categoría →</Link>
        </div>
        <div className="categoria">
          {/* CORREGIDO: Se quitó /img_index/ de la ruta */}
          <img src="/accesorios.png" alt="Accesorios" />
          <h3>Accesorios</h3>
          <Link to="/productos?categoria=Accesorios">Ver categoría →</Link>
        </div>
        <div className="categoria">
          {/* CORREGIDO: Se quitó /img_index/ de la ruta */}
          <img src="/CONSOLAS.png" alt="Consolas" />
          <h3>Consolas</h3>
          <Link to="/productos?categoria=Consolas">Ver categoría →</Link>
        </div>
        <div className="categoria">
          {/* CORREGIDO: Se quitó /img_index/ de la ruta */}
          <img src="/PC1.png" alt="Computadores Gamers" />
          <h3>Computadores Gamers</h3>
          <Link to="/productos?categoria=Computadores%20Gamers">Ver categoría →</Link>
        </div>
        <div className="categoria">
          {/* CORREGIDO: Se quitó /img_index/ de la ruta */}
          <img src="/Silla_gamer.png" alt="Sillas Gamers" />
          <h3>Sillas Gamers</h3>
          <Link to="/productos?categoria=Sillas%20Gamers">Ver categoría →</Link>
        </div>
      </section>

      {/* --- Productos destacados --- */}
      <section className="productos">
        <h2 className="titulo-seccion">PRODUCTOS DESTACADOS</h2>
        <div className="grid-productos">
          
          {/* Esta sección ya usa ProductCard, que lee las rutas
              correctas desde 'productos.js' (que ya corregimos) */}
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