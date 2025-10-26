// En: src/components/AppNavbar.jsx

import React, { useState, useEffect } from 'react';
// Importamos solo Form y Button de react-bootstrap
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// Importamos los iconos necesarios
import { FaUser, FaShoppingCart, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
// Importamos el hook de autenticación
import { useAuth } from '../hooks/useAuth.jsx';
// --- CORRECCIÓN ---
// Importamos la FUNCIÓN getProductos (y quitamos la importación duplicada)
import { getProductos } from '../data/productos.js';
// --- FIN CORRECCIÓN ---


function AppNavbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [showRecomendaciones, setShowRecomendaciones] = useState(false);

  // Lógica de recomendaciones (ahora usa getProductos())
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      // Llamamos a getProductos() para obtener la lista actualizada
      const productosActuales = getProductos();
      const coincidencias = productosActuales.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setRecomendaciones(coincidencias);
      setShowRecomendaciones(coincidencias.length > 0);
    } else {
      setRecomendaciones([]);
      setShowRecomendaciones(false);
    }
  }, [searchTerm]);

  // Manejar envío de búsqueda (solo envía el término 'q')
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowRecomendaciones(false);
    navigate(`/productos?q=${encodeURIComponent(searchTerm)}`);
  };

  // Clic en recomendación
  const handleRecommendationClick = (codigo) => {
    setShowRecomendaciones(false);
    setSearchTerm('');
    navigate(`/producto/${codigo}`);
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="encabezado">
      <div className="barra-superior">

        <Link to="/" className="logo">
          <img src="/logo_main.png" alt="LevelUP Gamer Logo" />
        </Link>

        {/* --- FORMULARIO DE BÚSQUEDA CON BOTÓN INTERNO --- */}
        <Form className="buscador position-relative" onSubmit={handleSearchSubmit}>
          {/* Input de Búsqueda */}
          <Form.Control
            type="text"
            placeholder="Busque productos aquí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setShowRecomendaciones(false), 150)}
            onFocus={() => searchTerm.trim().length > 1 && setShowRecomendaciones(true)}
            // Padding a la derecha para dejar espacio al botón interno
            style={{ paddingRight: '40px' }}
          />
          {/* Botón Lupa Interno (clase CSS específica) */}
          <Button type="submit" className="btn-busqueda-interno">
            <FaSearch />
          </Button>

          {/* Dropdown de Recomendaciones */}
          {showRecomendaciones && recomendaciones.length > 0 && (
            <div className="recomendaciones-dropdown">
              {recomendaciones.map(prod => (
                <div
                  key={prod.codigo}
                  className="recomendacion-item"
                  onMouseDown={() => handleRecommendationClick(prod.codigo)}
                >
                  <img src={prod.img || prod.imagen} alt={prod.nombre} width="30" height="30" className="me-2"/>
                  {prod.nombre} - <span className="text-muted">${prod.precio.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          )}
        </Form>
        {/* --- FIN FORMULARIO BÚSQUEDA --- */}

        {/* Iconos Dinámicos */}
        <div className="iconos">
          {usuario ? (
            <>
              <Link to="/perfil"><Button title={`Mi Perfil - ${usuario.nombre}`}> <FaUserCircle /> </Button></Link>
              <Button onClick={handleLogout} title="Cerrar Sesión"> <FaSignOutAlt /> </Button>
            </>
          ) : (
            <Link to="/login"><Button title="Iniciar Sesión"> <FaUser /> </Button></Link>
          )}
          <Link to="/carrito"><Button title="Carrito"> <FaShoppingCart /> </Button></Link>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="navegacion">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
        <Button className="btn-tiendas">Eventos</Button>
      </nav>
    </header>
  );
}

export default AppNavbar;