// En: src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
// --- ¡BORRAMOS LA IMPORTACIÓN ESTÁTICA! ---
// import { productos } from '../data/productos.js'; 
import { useCart } from '../hooks/useCart.jsx';

const Home = () => {
  // Estado para los productos que el ADMIN eligió
  const [productosDestacados, setProductosDestacados] = useState([]);
  const { agregarAlCarrito } = useCart();

  // --- ¡LÓGICA CORREGIDA! ---
  useEffect(() => {
    // Leemos la lista de destacados que guardó el admin
    const destacadosGuardados = JSON.parse(localStorage.getItem("destacados")) || [];
    setProductosDestacados(destacadosGuardados);
  }, []); // El [] vacío hace que se cargue solo al inicio

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    alert(`Agregado ${producto.nombre} al carrito!`);
    // (O puedes implementar el ModalFeedback aquí si lo prefieres)
  };

  return (
    <>
      {/* --- Banner (Sin cambios) --- */}
      <section className="banner">
        <img src="/banner.png" alt="Promoción Gamer" />
        <div className="banner-text">
          <h2>Equipamiento Gamer</h2>
          <p>Consolas, PCs, Sillas y más 🚀</p>
          <Link to="/productos" className="btn">¡Explorar ahora!</Link>
        </div>
      </section>

      {/* --- Sección de categorías (Sin cambios, como pediste) --- */}
      <section className="categorias">
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

      {/* --- Productos destacados (Ahora es dinámico) --- */}
      <section className="productos">
        <h2 className="titulo-seccion">PRODUCTOS DESTACADOS</h2>
        <div className="grid-productos">
          
          {productosDestacados.length > 0 ? (
            productosDestacados.map((prod) => (
              <ProductCard 
                key={prod.codigo} 
                producto={prod} 
                onAgregarAlCarrito={handleAgregarAlCarrito}
              />
            ))
          ) : (
            <p className="text-center">El administrador aún no ha destacado productos.</p>
          )}

        </div>
      </section>
    </>
  );
};

export default Home;