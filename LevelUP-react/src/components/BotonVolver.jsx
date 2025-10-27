// En: src/components/BotonVolver.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

// Le pasamos 'props' para poder añadir clases CSS o estilos si es necesario
function BotonVolver({ className = '', style = {} }) {
  const navigate = useNavigate();

  // Esta función es la clave: navigate(-1) es igual a "history.back()"
  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <Button
      onClick={handleVolver}
      className={`mb-3 ${className}`} // Le añadimos un margen abajo por defecto
      style={style}
      variant="outline-secondary" // Un estilo discreto
      title="Volver a la página anterior (Esc)"
    >
      <FaArrowLeft /> Volver
    </Button>
  );
}

export default BotonVolver;