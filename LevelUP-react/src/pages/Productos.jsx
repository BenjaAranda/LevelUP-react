// En: src/pages/Productos.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// Importamos los datos de nuestro "simulador de DB"
import { productos as todosLosProductos } from '../data/productos.js';
import { useCart } from '../hooks/useCart.jsx';
import '../styles/productos.css'; // Estilos

// (Modal simple para feedback)
const ModalFeedback = ({ producto, show, onHide }) => {
  if (!show) return null;
  return (
    <div className="modal-carrito-feedback" onClick={onHide}>
      <div className="modal-contenido">
        <h2>Producto agregado</h2>
        <p>Se ha agregado <span>{producto.nombre}</span> al carrito 🛒</p>
        <button onClick={onHide}>Cerrar</button>
      </div>
    </div>
  );
};

const Productos = () => {
  // --- Hooks y Contexto ---
  const [searchParams] = useSearchParams();
  const { agregarAlCarrito } = useCart();

  // --- Estado para Filtros (de tu productos.js) ---
  const [orden, setOrden] = useState('default');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(2000000);
  
  // --- Estado para la lista de productos que se muestra ---
  const [productosMostrados, setProductosMostrados] = useState([]);
  
  // --- Estado para el modal de "Agregado" (de tu productos.js) ---
  const [modalShow, setModalShow] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState(null);

  // --- Lógica de Filtros (de tu productos.js) ---
  useEffect(() => {
    let lista = [...todosLosProductos];

    // 1. Filtrar por Categoría
    if (categoria && categoria !== "todas") {
      lista = lista.filter(p => p.categoria === categoria);
    }

    // 2. Filtrar por Precio
    lista = lista.filter(p => p.precio >= precioMin && p.precio <= precioMax);

    // 3. Ordenar
    switch (orden) {
      case "precioMayor":
        lista.sort((a, b) => b.precio - a.precio);
        break;
      case "precioMenor":
        lista.sort((a, b) => a.precio - b.precio);
        break;
      case "a-z":
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "z-a":
        lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        // Sin orden o 'default'
        break;
    }
    
    setProductosMostrados(lista);

  }, [orden, categoria, precioMin, precioMax]); // Se ejecuta cada vez que un filtro cambia

  // --- Manejador del botón "Agregar al carrito" ---
  const handleAgregarCarrito = (producto) => {
    agregarAlCarrito(producto);
    setProductoAgregado(producto);
    setModalShow(true);
  };

  return (
    <>
      <ModalFeedback producto={productoAgregado} show={modalShow} onHide={() => setModalShow(false)} />

      <div className="productos-page">
        {/* --- Filtros (de tu productos.html) --- */}
        <aside className="filtros">
          <h3>Filtros</h3>
          <label htmlFor="ordenar">Ordenar</label>
          <select id="ordenar" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="default">Por defecto</option>
            <option value="precioMayor">Mayor precio</option>
            <option value="precioMenor">Menor precio</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>

          <label htmlFor="categoria-filtro">Categoría</label>
          <select id="categoria-filtro" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="Juegos de Mesa">Juegos de Mesa</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Consolas">Consolas</option>
            <option value="Computadores Gamers">Computadores Gamers</option>
            <option value="Sillas Gamers">Sillas Gamers</option>
            <option value="Mouse">Mouse</option>
            <option value="Mousepad">Mousepad</option>
            <option value="Poleras Personalizadas">Poleras Personalizadas</option>
            <option value="Polerones Gamers Personalizados">Polerones Gamers Personalizados</option>
          </select>

          <label htmlFor="precioMin">Precio mínimo</label>
          <input type="number" id="precioMin" value={precioMin} onChange={(e) => setPrecioMin(e.target.valueAsNumber || 0)} />
          <label htmlFor="precioMax">Precio máximo</label>
          <input type="number" id="precioMax" value={precioMax} onChange={(e) => setPrecioMax(e.target.valueAsNumber || 2000000)} />

          {/* El botón de filtrar ya no es necesario, se filtra solo */}
        </aside>

        {/* --- Lista de productos (de tu productos.html) --- */}
        <section className="lista-productos" id="listaProductos">
          {productosMostrados.length > 0 ? (
            productosMostrados.map(prod => (
              <div className="producto" key={prod.codigo}>
                <img src={prod.imagen} alt={prod.nombre} />
                <h3>{prod.nombre}</h3>
                <p><strong>Categoría:</strong> {prod.categoria}</p>
                <p className="precio">${prod.precio.toLocaleString("es-CL")} CLP</p>
                <button className="btn-carrito" onClick={() => handleAgregarCarrito(prod)}>
                  Agregar al carrito
                </button>
                {/* --- Link a la página de detalle --- */}
                <Link to={`/producto/${prod.codigo}`} className="btn-detalle">
                  Ver detalle
                </Link>
              </div>
            ))
          ) : (
            <p>No se encontraron productos con esos filtros.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default Productos;