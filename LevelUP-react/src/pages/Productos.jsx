// En: src/pages/Productos.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productos as todosLosProductos } from '../data/productos.js';
import { useCart } from '../hooks/useCart.jsx';
import ProductCard from '../components/ProductCard.jsx'; // <-- 1. USAMOS EL COMPONENTE
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
  const [searchParams] = useSearchParams();
  const { agregarAlCarrito } = useCart();

  const [orden, setOrden] = useState('default');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(2000000);
  
  const [productosMostrados, setProductosMostrados] = useState([]);
  
  // --- 2. Estado para las categorías dinámicas ---
  const [categorias, setCategorias] = useState([]);
  
  const [modalShow, setModalShow] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState(null);

  useEffect(() => {
    let lista = [...todosLosProductos];

    if (categoria && categoria !== "todas") {
      lista = lista.filter(p => p.categoria === categoria);
    }

    lista = lista.filter(p => p.precio >= precioMin && p.precio <= precioMax);

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
        break;
    }
    
    setProductosMostrados(lista);

    // --- 3. Generamos la lista de categorías dinámicamente ---
    if (categorias.length === 0) {
      const allCategories = [...new Set(todosLosProductos.map(p => p.categoria))].sort();
      setCategorias(allCategories);
    }

  }, [orden, categoria, precioMin, precioMax, categorias.length]);

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
          <label htmlFor="ordenar">Ordenar</label>
          <select id="ordenar" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="default">Por defecto</option>
            <option value="precioMayor">Mayor precio</option>
            <option value="precioMenor">Menor precio</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>

          <label htmlFor="categoria-filtro">Categoría</label>
          {/* --- 4. Renderizamos las categorías dinámicamente --- */}
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
          {productosMostrados.length > 0 ? (
            // --- 5. Usamos el componente ProductCard ---
            productosMostrados.map(prod => (
              <ProductCard 
                key={prod.codigo} 
                producto={prod} 
                onAgregarAlCarrito={handleAgregarCarrito}
              />
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