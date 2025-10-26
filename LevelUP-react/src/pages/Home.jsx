// En: src/pages/Home.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap'; 

// --- CORRECCIÓN ---
// Importamos la FUNCIÓN getProductos
import { getProductos } from '../data/productos.js'; 
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../hooks/useCart.jsx';
// --- FIN CORRECCIÓN ---


const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    console.log("Home.jsx - useEffect ejecutándose");
    try {
        // --- CORRECCIÓN ---
        // Llamamos a getProductos() para obtener la lista actualizada
        const todosLosProductos = getProductos(); 
        console.log("Home.jsx - Productos cargados desde getProductos:", todosLosProductos);
        const destacados = todosLosProductos.slice(0, 8);
        console.log("Home.jsx - Productos a destacar:", destacados);
        setProductosDestacados(destacados);
        // --- FIN CORRECCIÓN ---
    } catch(error) {
        console.error("Home.jsx - Error al cargar productos en useEffect:", error);
        setProductosDestacados([]); 
    }
  }, []); 

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    alert(`Agregado ${producto.nombre} al carrito!`); 
  };

  return (
    <> 
      {/* --- Banner --- */}
      <section className="banner">
        <img src="/banner.png" alt="Promoción Gamer" />
        <div className="banner-text">
          <h2>Equipamiento Gamer</h2>
          <p>Consolas, PCs, Sillas y más 🚀</p>
          <Link to="/productos" className="btn">¡Explorar ahora!</Link>
        </div>
      </section>

      {/* --- Sección de categorías --- */}
      <section className="categorias">
         {/* Código de categorías */}
         <div className="categoria">
          <img src="/catan.png" alt="Juegos de Mesa" />
          <h3>Juegos de Mesa</h3>
          <Link to="/productos?categoria=Juegos%20de%20Mesa">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/accesorios.png" alt="Accesorios" />
          <h3>Accesorios</h3>
          <Link to="/productos?categoria=Accesorios">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/CONSOLAS.png" alt="Consolas" />
          <h3>Consolas</h3>
          <Link to="/productos?categoria=Consolas">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/PC1.png" alt="Computadores Gamers" />
          <h3>Computadores Gamers</h3>
          <Link to="/productos?categoria=Computadores%20Gamers">Ver categoría →</Link>
        </div>
        <div className="categoria">
          <img src="/Silla_gamer.png" alt="Sillas Gamers" />
          <h3>Sillas Gamers</h3>
          <Link to="/productos?categoria=Sillas%20Gamers">Ver categoría →</Link>
        </div>
      </section>

      {/* --- Productos destacados --- */}
      <section className="productos">
        <h2 className="titulo-seccion">PRODUCTOS DESTACADOS</h2>
        <div className="grid-productos">
          
          {productosDestacados && productosDestacados.length > 0 ? (
            productosDestacados.map((prod) => (
              <ProductCard 
                key={prod.codigo} 
                producto={prod} 
                onAgregarAlCarrito={handleAgregarAlCarrito}
              />
            ))
          ) : (
            <p style={{ color: 'yellow', gridColumn: '1 / -1', textAlign: 'center' }}>
              No hay productos destacados para mostrar.
            </p> 
          )}

        </div>
      </section>
    </> 
  );
};

export default Home;