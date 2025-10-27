// En: src/data/ordenes.js

const ORDENES_KEY = 'ordenes'; // Clave en localStorage

// Obtener todas las órdenes guardadas
export const getOrdenes = () => {
  const ordenesGuardadas = localStorage.getItem(ORDENES_KEY);
  if (ordenesGuardadas) {
    try {
      const parsed = JSON.parse(ordenesGuardadas);
      // Validamos que sea un array y tenga estructura básica
      if (Array.isArray(parsed) && parsed.every(o => o && o.id && o.fecha && Array.isArray(o.items))) {
        // Ordenamos por fecha descendente (más recientes primero)
        return parsed.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      }
    } catch (error) {
      console.error("Error al parsear órdenes de localStorage:", error);
    }
  }
  // Si no hay nada o hay error, devuelve array vacío
  return []; 
};

// Guardar la lista completa de órdenes
const saveOrdenes = (ordenes) => {
  if (!Array.isArray(ordenes)) {
    console.error("Se intentó guardar algo que no es un array en localStorage para 'ordenes'.");
    return;
  }
  try {
    localStorage.setItem(ORDENES_KEY, JSON.stringify(ordenes));
  } catch (error) {
    console.error("Error al guardar órdenes en localStorage:", error);
  }
};

// Guardar una nueva orden
export const guardarOrden = (nuevaOrden) => {
  if (!nuevaOrden || !nuevaOrden.id) {
     console.error("Intento de guardar una orden inválida:", nuevaOrden);
     return; // No guarda si la orden no es válida
  }
  const ordenesActuales = getOrdenes(); // Obtiene la lista actual (ya ordenada)
  // Añade la nueva orden al PRINCIPIO para mantener el orden descendente
  const nuevaLista = [nuevaOrden, ...ordenesActuales]; 
  saveOrdenes(nuevaLista);
  console.log("Orden guardada exitosamente:", nuevaOrden.id);
};

// Obtener una orden específica por su ID
export const getOrdenPorId = (id) => {
  const ordenes = getOrdenes();
  // Comparamos 'id' como número, ya que Date.now() es un número
  return ordenes.find(o => o.id === Number(id)); 
};
// (Opcional: Funciones futuras como getOrdenPorId, etc.)
 