import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/axiosClient'; // Conexión API
import { useCart } from '../hooks/useCart.jsx';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import ProductCard from '../components/ProductCard.jsx'; 
import '../styles/productos.css'; 

const Productos = () => {
  const [searchParams] = useSearchParams();
  const { agregarAlCarrito } = useCart();
  
  useGoBackOnEsc();

  // Estados
  const [orden, setOrden] = useState('default');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(2000000);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  // Estados para datos
  const [allProductos, setAllProductos] = useState([]); // Todos los productos del backend
  const [productosMostrados, setProductosMostrados] = useState([]); // Filtrados
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar productos desde el Backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await client.get('/productos');
        setAllProductos(response.data);
        
        // Extraer categorías únicas de la respuesta
        const cats = [...new Set(response.data.map(p => p.categoria))].sort();
        setCategorias(cats);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // 2. Filtrado Local (Se ejecuta cuando cambian los filtros o la data)
  useEffect(() => {
    let lista = [...allProductos]; 
    
    if (searchTerm) {
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoria && categoria !== "todas") {
      lista = lista.filter(p => p.categoria === categoria);
    }
    // Aseguramos que precio sea número
    lista = lista.filter(p => (p.precio || 0) >= precioMin && (p.precio || 0) <= precioMax);

    switch (orden) {
      case "precioMayor": lista.sort((a, b) => b.precio - a.precio); break;
      case "precioMenor": lista.sort((a, b) => a.precio - b.precio); break;
      case "a-z": lista.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case "z-a": lista.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
      default: break;
    }
    
    setProductosMostrados(lista);
  }, [orden, categoria, precioMin, precioMax, searchTerm, allProductos]); 

  const handleAgregarCarrito = (producto) => {
    agregarAlCarrito(producto);
  };

  if (loading) {
    return <div className="text-center mt-5"><h3>Cargando catálogo...</h3></div>;
  }

  return (
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
            productosMostrados.map(prod => (
              <ProductCard
                key={prod.codigo || prod.id}
                producto={prod}
                onAgregarAlCarrito={handleAgregarCarrito}
              />
            ))
          ) : (
             <p style={{ color: 'yellow', gridColumn: '1 / -1', textAlign: 'center' }}>
               No se encontraron productos con esos filtros.
             </p>
          )}
        </section>
      </div>
  );
};

export default Productos;