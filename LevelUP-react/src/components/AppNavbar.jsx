// En: src/components/AppNavbar.jsx

import React from 'react';
import { Form, Button } from 'react-bootstrap'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// 1. Importamos el hook de autenticación
import { useAuth } from '../hooks/useAuth.jsx';

function AppNavbar() {
  // 2. Obtenemos el usuario y la función de logout
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirigimos al Home
  };

  return (
    <header className="encabezado">
      <div className="barra-superior">
        
        <Link to="/" className="logo">
          <img src="/logo_main.png" alt="LevelUP Gamer Logo" />
        </Link>

        <Form className="buscador">
          <Form.Select aria-label="Selector de categorías">
            <option value="todas">Todas</option>
            <option value="juegos">Juegos</option>
            <option value="hardware">Hardware</option>
            <option value="accesorios">Accesorios</option>
          </Form.Select>
          <Form.Control type="text" placeholder="Busca tus productos gamer..." />
          <Button type="submit" className="btn-busqueda">
            <FaSearch />
          </Button>
        </Form>

        {/* --- 3. SECCIÓN DE ICONOS DINÁMICA --- */}
        <div className="iconos"> 
          {usuario ? (
            // --- SI EL USUARIO ESTÁ LOGUEADO ---
            <>
              <Link to="/perfil">
                <Button title="Mi Perfil">
                  {/* Mostramos su nombre en el Tooltip */}
                  <span style={{fontSize: '0.9rem', marginRight: '5px'}}>
                    Hola, {usuario.nombre}
                  </span>
                  <FaUserCircle />
                </Button>
              </Link>
              <Button onClick={handleLogout} title="Cerrar Sesión">
                <FaSignOutAlt />
              </Button>
            </>
          ) : (
            // --- SI EL USUARIO NO ESTÁ LOGUEADO ---
            <Link to="/login">
              <Button title="Iniciar Sesión">
                <FaUser />
              </Button>
            </Link>
          )}
          
          {/* El carrito siempre se muestra */}
          <Link to="/carrito">
            <Button title="Carrito">
              <FaShoppingCart />
            </Button>
          </Link>
        </div>
      </div>

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