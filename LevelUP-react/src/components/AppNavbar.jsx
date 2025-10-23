// En: src/components/AppNavbar.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth.jsx';
import { productos } from '../data/productos.js';

function AppNavbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [showRecomendaciones, setShowRecomendaciones] = useState(false);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const coincidencias = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setRecomendaciones(coincidencias);
      setShowRecomendaciones(coincidencias.length > 0);
    } else {
      setRecomendaciones([]);
      setShowRecomendaciones(false);
    }
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowRecomendaciones(false);
    navigate(`/productos?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleRecommendationClick = (codigo) => {
    setShowRecomendaciones(false);
    setSearchTerm('');
    navigate(`/producto/${codigo}`);
  };

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
        {/* Usamos 'position-relative' para el botón y el dropdown */}
        <Form className="buscador position-relative" onSubmit={handleSearchSubmit}>
          {/* 1. SE ELIMINÓ EL Form.Select */}

          {/* Input de Búsqueda */}
          <Form.Control
            type="text"
            placeholder="Busque productos aquí..." // Placeholder como en la imagen
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setShowRecomendaciones(false), 150)}
            onFocus={() => searchTerm.trim().length > 1 && setShowRecomendaciones(true)}
            // Añadimos padding a la derecha para que el texto no quede debajo del botón
            style={{ paddingRight: '40px' }} 
          />
          {/* Botón Lupa (Ahora posicionado absolutamente) */}
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

        {/* Iconos (sin cambios) */}
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

      {/* Navegación (sin cambios) */}
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