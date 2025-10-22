// En: src/components/AppNavbar.jsx

import React from 'react';
// ¡OJO! Ya no importamos Form.Select, solo Form, Button
import { Form, Button } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';

function AppNavbar() {
  return (
    <header className="encabezado">
      <div className="barra-superior">
        <Link to="/" className="logo">
          <img src="/img/logo.png" alt="LevelUP Logo" />
        </Link>

        <Form className="buscador">
          {/* --- ESTE ES EL CAMBIO --- */}
          {/* Hemos reemplazado <Form.Select> por un <select> normal */}
          <select className="form-select">
            <option value="0">Categorías</option>
            <option value="1">Juegos</option>
            <option value="2">Hardware</option>
          </select>
          {/* --- FIN DEL CAMBIO --- */}
          <Form.Control type="text" placeholder="Buscar..." />
        </Form>

        <div className="iconos">
          <Button>Iniciar Sesión</Button>
          <Button>Carrito</Button>
        </div>
      </div>

      <nav className="navegacion">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/categorias">Categorías</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/ofertas">Ofertas</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
        </ul>
        <Button className="btn-tiendas">Tiendas/Eventos</Button>
      </nav>
    </header>
  );
}

export default AppNavbar;