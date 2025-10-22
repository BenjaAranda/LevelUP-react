// En: src/pages/Contacto.jsx

import React, { useState } from 'react';
// Importamos los estilos (asegúrate de crear este archivo)
import '../styles/contacto.css'; 

const Contacto = () => {
  // --- Estados para los campos del formulario ---
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [comentario, setComentario] = useState('');

  // --- Estado para los mensajes de error (reemplaza showInlineError) ---
  const [errores, setErrores] = useState({});

  // --- Estado para el mensaje de éxito ---
  const [exito, setExito] = useState(false);

  // --- Lógica de Validación (de tu contacto.js) ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene que la página se recargue

    // Limpiamos errores y éxito anteriores
    setErrores({});
    setExito(false);

    // --- 1. Validaciones ---
    const nuevosErrores = {};

    // Validar nombre
    if (nombre.trim() === '' || nombre.trim().length > 100) {
      nuevosErrores.nombre = 'El nombre es requerido y debe tener máximo 100 caracteres.';
    }

    // Validar correo (misma Regex)
    const regexCorreo = /^[\w.%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!regexCorreo.test(correo.trim())) {
      nuevosErrores.correo = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com';
    }

    // Validar comentario
    if (comentario.trim() === '' || comentario.trim().length > 500) {
      nuevosErrores.comentario = 'El comentario es requerido y debe tener máximo 500 caracteres.';
    }

    // --- 2. Comprobar resultados ---
    if (Object.keys(nuevosErrores).length > 0) {
      // Si hay errores, los mostramos
      setErrores(nuevosErrores);
    } else {
      // Si todo está OK:
      console.log('Formulario válido, enviando:', { nombre, correo, comentario });
      
      // Mostramos mensaje de éxito
      setExito(true);
      
      // Limpiamos el formulario
      setNombre('');
      setCorreo('');
      setComentario('');
      
      // Ocultamos el mensaje de éxito después de 8 segundos (como en tu JS)
      setTimeout(() => {
        setExito(false);
      }, 8000);
    }
  };


  return (
    <>
      {/* --- Banner Contacto --- */}
      <section className="banner-contacto">
        <h1>Contáctanos</h1>
        <p>¿Tienes dudas o problemas? Escríbenos, estamos para ayudarte</p>
      </section>

      {/* --- Formulario de Contacto --- */}
      <section className="formulario-contacto">
        <h2>Envíanos un mensaje</h2>

        {/* Mensaje de Éxito (controlado por React) */}
        {exito && (
          <div id="mensaje-exito" className="mensaje-exito" style={{ display: 'block' }}>
            <strong>¡Mensaje enviado!</strong> Gracias por contactarnos.
          </div>
        )}
        
        <form id="contactoForm" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input 
              type="text" 
              id="nombre" 
              maxLength="100" 
              required 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {/* Mensaje de Error (controlado por React) */}
            {errores.nombre && <small className="error-field">{errores.nombre}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo *</label>
            <input 
              type="email" 
              id="correo" 
              maxLength="100" 
              required 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <small>Solo se permiten: @duoc.cl | @profesor.duoc.cl | @gmail.com</small>
            {/* Mensaje de Error (controlado por React) */}
            {errores.correo && <small className="error-field">{errores.correo}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="comentario">Comentario *</label>
            <textarea 
              id="comentario" 
              rows="5" 
              maxLength="500" 
              required
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            ></textarea>
            {/* Mensaje de Error (controlado por React) */}
            {errores.comentario && <small className="error-field">{errores.comentario}</small>}
          </div>

          <button type="submit" className="btn-enviar">Enviar</button>
        </form>
      </section>

      {/* --- Botón de WhatsApp --- */}
      <section className="whatsapp-contacto">
        <p>¿Prefieres hablar con soporte técnico directo?</p>
        <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          💬 Chatear por WhatsApp
        </a>
      </section>
    </>
  );
};

export default Contacto;