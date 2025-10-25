// En: src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap'; // Añadido Container si no estaba

// 1. VERIFICA ESTA RUTA DE IMPORTACIÓN
import { productos } from '../data/productos.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../hooks/useCart.jsx';

// Log para verificar si los productos se importan
console.log("Home.jsx - Productos importados:", productos); 

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    console.log("Home.jsx - useEffect ejecutándose");
    // Simulamos carga y mostramos los primeros 8 (o todos si hay menos)
    const destacados = productos.slice(0, 8);
    console.log("Home.jsx - Productos a destacar:", destacados);
    setProductosDestacados(destacados);
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    alert(`Agregado ${producto.nombre} al carrito!`); 
  };

  return (
    // Usamos Container para centrar y añadir padding
    <Container> 
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
        {/* ... (código de categorías sin cambios) ... */}
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
          
          {/* 2. VERIFICAMOS SI HAY PRODUCTOS ANTES DE MAPEAR */}
          {productosDestacados && productosDestacados.length > 0 ? (
            productosDestacados.map((prod) => {
              // Log para cada producto que se intenta renderizar
              console.log("Home.jsx - Renderizando ProductCard para:", prod); 
              return (
                <ProductCard 
                  key={prod.codigo} 
                  producto={prod} 
                  onAgregarAlCarrito={handleAgregarAlCarrito}
                />
              );
            })
          ) : (
            // Mensaje si no hay productos en el estado
            <p style={{ color: 'yellow', gridColumn: '1 / -1' }}>Cargando productos destacados...</p> 
          )}

        </div>
      </section>
    </Container>
  );
};

export default Home;