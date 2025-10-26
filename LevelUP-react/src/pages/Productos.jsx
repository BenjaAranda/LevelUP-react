// En: src/pages/Productos.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// --- CORRECCIÓN ---
// Importamos la FUNCIÓN getProductos
import { getProductos } from '../data/productos.js';
// --- FIN CORRECCIÓN ---
import { useCart } from '../hooks/useCart.jsx';
import ProductCard from '../components/ProductCard.jsx';
import '../styles/productos.css';

// (Componente ModalFeedback - sin cambios)
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
  const [searchParams] = useSearchParams();
  const { agregarAlCarrito } = useCart();

  const [orden, setOrden] = useState('default');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(2000000);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const [productosMostrados, setProductosMostrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState(null);

  useEffect(() => {
    console.log("Productos.jsx - useEffect ejecutándose con filtros:", { orden, categoria, precioMin, precioMax, searchTerm });
    // --- CORRECCIÓN ---
    // Llamamos a getProductos() para obtener la lista actualizada CADA VEZ que los filtros cambian
    let lista = getProductos();
    // --- FIN CORRECCIÓN ---
    console.log("Productos.jsx - Productos cargados:", lista);

    if (searchTerm) {
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoria && categoria !== "todas") {
      lista = lista.filter(p => p.categoria === categoria);
    }
    lista = lista.filter(p => p.precio >= precioMin && p.precio <= precioMax);

    switch (orden) {
      case "precioMayor": lista.sort((a, b) => b.precio - a.precio); break;
      case "precioMenor": lista.sort((a, b) => a.precio - b.precio); break;
      case "a-z": lista.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case "z-a": lista.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
      default: break;
    }

    console.log("Productos.jsx - Productos filtrados:", lista);
    setProductosMostrados(lista);

    // Generamos categorías dinámicas desde la lista COMPLETA de productos
    // Solo lo hacemos una vez o si la lista original cambia (poco probable con localStorage)
    if (categorias.length === 0) {
        const todosLosProductos = getProductos(); // Obtenemos todos para las categorías
        if (todosLosProductos.length > 0) {
            const allCategories = [...new Set(todosLosProductos.map(p => p.categoria))].sort();
            console.log("Productos.jsx - Categorías generadas:", allCategories);
            setCategorias(allCategories);
        }
    }

  }, [orden, categoria, precioMin, precioMax, searchTerm, categorias.length]); // useEffect se ejecuta si cambia algún filtro

  const handleAgregarCarrito = (producto) => {
    agregarAlCarrito(producto);
    setProductoAgregado(producto);
    setModalShow(true);
  };

  return (
    <>
      <ModalFeedback producto={productoAgregado} show={modalShow} onHide={() => setModalShow(false)} />

      <div className="productos-page">
        <aside className="filtros">
          <h3>Filtros</h3>
          {searchTerm && (
            <div className="mb-3">
              <p>Buscando: <strong>"{searchTerm}"</strong></p>
              <button className="btn btn-outline-light btn-sm" onClick={() => setSearchTerm('')}>Limpiar búsqueda</button>
            </div>
          )}

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
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>


          <label htmlFor="precioMin">Precio mínimo</label>
          <input type="number" id="precioMin" value={precioMin} onChange={(e) => setPrecioMin(e.target.valueAsNumber || 0)} />
          <label htmlFor="precioMax">Precio máximo</label>
          <input type="number" id="precioMax" value={precioMax} onChange={(e) => setPrecioMax(e.target.valueAsNumber || 2000000)} />
        </aside>

        <section className="lista-productos" id="listaProductos">
          {productosMostrados && productosMostrados.length > 0 ? (
            productosMostrados.map(prod => {
              // console.log("Productos.jsx - Renderizando ProductCard para:", prod);
              return (
                <ProductCard
                  key={prod.codigo}
                  producto={prod}
                  onAgregarAlCarrito={handleAgregarCarrito}
                />
              );
            })
          ) : (
             <p style={{ color: 'yellow', gridColumn: '1 / -1', textAlign: 'center' }}>
               No se encontraron productos con esos filtros.
             </p>
          )}
        </section>
      </div>
    </>
  );
};

export default Productos;