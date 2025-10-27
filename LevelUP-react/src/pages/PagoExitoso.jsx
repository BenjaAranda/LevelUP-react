// En: src/pages/PagoExitoso.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
// Importamos icono
import { FaCheckCircle } from 'react-icons/fa'; 
// Importamos función para buscar orden
import { getOrdenPorId } from '../data/ordenes.js'; 
import '../styles/pago-resultado.css'; // Estilos compartidos
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const PagoExitoso = () => {
  const { ordenId } = useParams();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useGoBackOnEsc();

  useEffect(() => {
    try {
      const ordenEncontrada = getOrdenPorId(ordenId);
      if (ordenEncontrada) {
        setOrden(ordenEncontrada);
      }
    } catch (error) {
      console.error("Error al buscar la orden:", error);
    } finally {
      setLoading(false);
    }
  }, [ordenId]);

  if (loading) {
    return <div className="resultado-container"><Alert variant="info">Cargando confirmación...</Alert></div>;
  }

  if (!orden) {
    return (
      <div className="resultado-container">
        <div className="resultado-card error">
          <div className="resultado-icono"><FaCheckCircle /></div> {/* Aún usamos ícono de éxito */}
          <h1>¡Compra Realizada con Éxito!</h1>
          <p>Tu orden fue procesada, pero no pudimos encontrar los detalles. ¡Gracias por tu compra!</p>
          <Link to="/" className="btn-volver-tienda">Volver a la Tienda</Link>
        </div>
      </div>
    );
  }

  // Si encontramos la orden
  return (
    <div className="resultado-container">
      <div className="resultado-card exito">
        <div className="resultado-icono"><FaCheckCircle /></div>
        <h1>¡Pago Exitoso!</h1>
        <p>Tu orden ha sido recibida y será procesada a la brevedad.</p>
        
        <div className="orden-detalles">
          <p><strong>Nº Orden:</strong> {orden.id}</p>
          <p><strong>Usuario:</strong> {orden.usuarioEmail}</p>
          <p><strong>Total Pagado:</strong> ${orden.total.toLocaleString('es-CL')}</p>
          <p><strong>Productos:</strong></p>
          <ul>
            {orden.items.map(item => (
              <li key={item.codigo} className="item">
                {item.nombre} (x{item.unidades})
              </li>
            ))}
          </ul>
        </div>

        <Link to="/" className="btn-volver-tienda">Volver a la Tienda</Link>
      </div>
    </div>
  );
};

export default PagoExitoso;