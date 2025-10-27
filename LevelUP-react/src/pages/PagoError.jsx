// En: src/pages/PagoError.jsx

import React from 'react';
import { Link } from 'react-router-dom';
// Importamos icono
import { FaTimesCircle } from 'react-icons/fa'; 
import '../styles/pago-resultado.css'; // Estilos compartidos
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const PagoError = () => {
  useGoBackOnEsc();
  
  return (
    <div className="resultado-container">
      <div className="resultado-card error"> {/* Usamos la clase 'error' */}
        <div className="resultado-icono"><FaTimesCircle /></div>
        <h1>Pago Fallido</h1>
        <p>
          No se pudo procesar tu pago (ej: stock insuficiente o error de simulación).
          Tu carrito no ha sido modificado.
        </p>
        
        {/* Botón para volver al checkout */}
        <Link to="/checkout" className="btn-reintentar">
          Volver a Intentarlo
        </Link>
        {/* Botón para volver a la tienda */}
        <Link to="/" className="btn-volver-tienda" style={{marginLeft: '10px'}}>
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
};

export default PagoError;