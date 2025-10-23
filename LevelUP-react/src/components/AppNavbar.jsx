// En: src/components/AppNavbar.jsx

import React from 'react';
// 1. CORREGIDO: Se eliminó el guion bajo antes de 'from'
import { Form, Button } from 'react-bootstrap'; 
// 2. CORREGIDO: Se eliminó el guion bajo antes de 'from'
import { Link } from 'react-router-dom';

// 3. IMPORTAMOS LOS ICONOS (Asegúrate de haber corrido: npm install react-icons)
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';

function AppNavbar() {
  return (
    <header className="encabezado">
      <div className="barra-superior">
        
        {/* LOGO (Corregido a /logo_main.png) */}
        <Link to="/" className="logo">
          <img src="/logo_main.png" alt="LevelUP Gamer Logo" />
        </Link>

        {/* BUSCADOR (Corregido con botón de lupa) */}
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

        {/* ICONOS (Corregidos con <Link> y <Button>) */}
        <div className="iconos"> 
          <Link to="/login">
            <Button>
              <FaUser />
            </Button>
          </Link>
          
          <Link to="/carrito">
            <Button>
              <FaShoppingCart />
            </Button>
          </Link>
        </div>
      </div>

      {/* NAVEGACIÓN (Corregida según tu imagen) */}
      <nav className="navegacion">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
        {/* BOTÓN EVENTOS (Corregido) */}
        <Button className="btn-tiendas">Eventos</Button>
      </nav>
    </header>
  );
}

export default AppNavbar;