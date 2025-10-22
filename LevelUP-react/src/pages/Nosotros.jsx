// En: src/pages/Nosotros.jsx

import React from 'react';
// Importamos los estilos específicos de esta página
import '../styles/nosotros.css'; 

const Nosotros = () => {
  return (
    // Usamos un Fragment (<>) para agrupar las secciones
    <>
      {/* --- Banner --- */}
      <section className="banner-nosotros">
        <h1>Sobre Nosotros</h1>
        <p>Conectamos tu pasión gamer con la mejor tecnología 🎮</p>
      </section>

      {/* --- Contenido Nosotros --- */}
      {/* Cambiamos <main> por <div> para no duplicar el <main> de App.jsx */}
      <div className="nosotros">
        <section className="quienes-somos">
          <h2>¿Quiénes somos?</h2>
          <p>
            En <strong>Level-Up Gamer</strong> somos una tienda gamer chilena fundada en 2022, dedicada a entregar la mejor
            experiencia en equipamiento y accesorios gamer. Nuestra misión es impulsar tu rendimiento y diversión con
            productos de calidad y un servicio cercano.
          </p>
        </section>

        <section className="mision-vision">
          <div className="mision">
            <h3>🎯 Misión</h3>
            <p>Ofrecer productos gamer de alta calidad que eleven la experiencia de juego de nuestros clientes.</p>
          </div>
          <div className="vision">
            <h3>🚀 Visión</h3>
            <p>Ser la tienda gamer líder en Chile y Latinoamérica, reconocida por innovación, cercanía y confianza.</p>
          </div>
        </section>

        <section className="valores">
          <h2>Nuestros Valores</h2>
          <ul>
            <li>⚡ Pasión por lo gamer</li>
            <li>💎 Calidad garantizada</li>
            <li>🤝 Cercanía con nuestros clientes</li>
            <li>🌍 Compromiso con la comunidad</li>
          </ul>
        </section>

        <section className="equipo">
          <h2>Conoce a nuestro equipo</h2>
          <div className="grid-equipo">
            <div className="miembro">
              <img src="/img_nosotros/equipo1.png" alt="Miembro 1" />
              <h4>Benjamín Aranda</h4>
              <p>Desarrollador Fullstack</p>
            </div>
            <div className="miembro">
              <img src="/img_nosotros/equipo2.png" alt="Miembro 2" />
              <h4>Joaquin Robles</h4>
              <p>Desarrollador Fullstack</p>
            </div>
            <div className="miembro">
              <img src="/img_nosotros/equipo3.png" alt="Miembro 3" />
              <h4>#######</h4>
              <p>Soporte Técnico</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Nosotros;