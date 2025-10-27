// En: src/hooks/useGoBackOnEsc.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useGoBackOnEsc() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Definimos la función que maneja el evento
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        navigate(-1); // Volver atrás
      }
    };

    // 2. Añadimos el 'escucha' al montar el componente
    document.addEventListener('keydown', handleEsc);

    // 3. ¡Importante! Limpiamos el 'escucha' al desmontar
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [navigate]); // El efecto depende de 'navigate'
}