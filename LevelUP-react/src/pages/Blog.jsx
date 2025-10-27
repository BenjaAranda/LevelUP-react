// En: src/pages/Blog.jsx

import React from 'react';
// Importamos los estilos que acabamos de crear
import '../styles/blog.css';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const Blog = () => {
  useGoBackOnEsc();
  
  return (
    // Usamos un Fragment (<>) porque App.jsx ya nos da el <main>
    <>
      {/* --- Banner Blog --- */}
      <section className="banner-blog">
        <h1>Noticias y Tendencias Gamer 🎮</h1>
        <p>Lo último del mundo gaming en Chile y el mundo</p>
      </section>

      {/* --- Artículo destacado --- */}
      <section className="blog-destacado">
        {/* Ruta de imagen corregida (está en /public/ps5pro.jpg) */}
        <img src="/ps5pro.jpg" alt="Artículo destacado" />
        <div className="texto">
          <h2>Review: La nueva PlayStation 5 Pro</h2>
          <p className="fecha">Publicado: 3 Septiembre 2025</p>
          <p>Te contamos todas las novedades de la PS5 Pro: rendimiento mejorado, gráficos de última generación y una experiencia inmersiva sin precedentes...</p>
          {/* Dejamos <a> normal (y no <Link>) porque es un link EXTERNO.
            Añadimos target y rel por seguridad.
          */}
          <a 
            href="https://www-ign-com.translate.goog/articles/playstation-5-pro-review?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc&_x_tr_hist=true"
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer más
          </a>
        </div>
      </section>

      {/* --- Lista de artículos --- */}
      <section className="blog-lista">
        <article className="blog-card">
          {/* Ruta de imagen corregida */}
          <img src="/sillas_blog.jpg" alt="Artículo 1" />
          <h3>Top 5 Sillas Gamers 2025</h3>
          <p className="fecha">2 Septiembre 2025</p>
          <p>Comodidad y ergonomía: te mostramos las mejores opciones de sillas gamers para largas sesiones.</p>
          <a 
            href="https://www.profesionalreview.com/mejores-sillas-gaming"
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer más
          </a>
        </article>

        <article className="blog-card">
          {/* Ruta de imagen corregida */}
          <img src="/streamers_blog.webp" alt="Artículo 2" />
          <h3>Accesorios imprescindibles para streamers</h3>
          <p className="fecha">1 Septiembre 2025</p>
          <p>Micrófonos, luces, capturadoras y más: todo lo que necesitas para mejorar tu setup de streaming.</p>
          <a 
            href="https://www.hobbyconsolas.com/noticias/5-accesorios-streamer-oferta-914153"
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer más
          </a>
        </article>

        <article className="blog-card">
          {/* Ruta de imagen corregida */}
          <img src="/esports.jpeg" alt="Artículo 3" />
          <h3>eSports en Chile: los torneos más esperados</h3>
          <p className="fecha">28 Agosto 2025</p>
          <p>Un repaso por los eventos de eSports que marcarán este semestre en el país.</p>
          <a 
            href="https://www.campeonatochileno.cl/ligas/esport"
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer más
          </a>
        </article>
      </section>
    </>
  );
};

export default Blog;