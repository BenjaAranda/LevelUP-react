// En: src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// NOTA: Tu CSS principal (main.css) ya debe estar importado en 'src/main.jsx'

const Home = () => {

  // --- Datos de ejemplo para los productos destacados ---
  // (En el futuro, esto vendría de una API)
  const productosDestacados = [
    { img: '/img_productos/catan.png', nombre: 'Catan', categoria: 'Juegos de Mesa', precio: 29990 },
    { img: '/img_productos/Carcassonne.png', nombre: 'Carcassonne', categoria: 'Juegos de Mesa', precio: 24990 },
    { img: '/img_productos/Controlador Xbox Series X.png', nombre: 'Controlador Xbox Series X', categoria: 'Accesorios', precio: 59990 },
    { img: '/img_productos/Auriculares HyperX Cloud II2.png', nombre: 'Auriculares HyperX Cloud II', categoria: 'Accesorios', precio: 79990 },
    { img: '/img_productos/PlayStation 5.webp', nombre: 'PlayStation 5', categoria: 'Consolas', precio: 549990 },
    { img: '/img_productos/PC Gamer ASUS ROG Strix.png', nombre: 'PC Gamer ASUS ROG Strix', categoria: 'Computadores Gamers', precio: 1299990 },
    { img: '/img_productos/Silla Gamer Secretlab Titan.webp', nombre: 'Silla Gamer Secretlab Titan', categoria: 'Sillas Gamers', precio: 349990 },
    { img: '/img_productos/Mouse Logitech G502 HERO.png', nombre: 'Mouse Logitech G502 HERO', categoria: 'Mouse', precio: 49990 },
  ];

  // Función placeholder para el carrito
  const handleAgregarAlCarrito = (nombre) => {
    alert(`Agregando ${nombre} al carrito... (próximamente con Context!)`);
    // Aquí es donde llamarías a la función de tu CartContext
  };

  return (
    <>
      {/* --- Banner --- */}
      {/* Reemplazamos <main> por un Fragment <> 
          porque el <main> ya está en App.jsx */}
      <section className="banner">
        {/* Asegúrate que esta imagen esté en public/img_index/banner.png */}
        <img src="/img_index/banner.png" alt="Promoción Gamer" />
        <div className="banner-text">
          <h2>Equipamiento Gamer</h2>
          <p>Consolas, PCs, Sillas y más 🚀</p>
          {/* Reemplazamos <a> por <Link> */}
          <Link to="/productos" className="btn">¡Explorar ahora!</Link>
        </div>
      </section>

      {/* --- Sección de categorías --- */}
      <section className="categorias">
        <div className="categoria">
          <img src="/img_productos/catan.png" alt="Juegos de Mesa" />
          <h3>Juegos de Mesa</h3>
          {/* El enlace ahora usa <Link> y un query param */}
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
          
          {/* --- Renderizamos los productos con .map() --- */}
          {productosDestacados.map((prod) => (
            <div className="producto" key={prod.nombre}>
              <img src={prod.img} alt={prod.nombre} />
              <h3 className="nombre">{prod.nombre}</h3>
              <p><strong>Categoría:</strong> {prod.categoria}</p>
              <p className="precio">${prod.precio.toLocaleString('es-CL')} CLP</p>
              <button 
                className="btn-carrito" 
                onClick={() => handleAgregarAlCarrito(prod.nombre)}
              >
                Agregar al carrito
              </button>
            </div>
          ))}

        </div>
      </section>
    </>
  );
};

export default Home;