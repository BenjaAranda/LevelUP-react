import React from 'react';
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
          <Form.Select aria-label="Selector de categorías">
            <option value="0">Categorías</option>
            <option value="1">Juegos</option>
            <option value="2">Hardware</option>
          </Form.Select>

          <Form.Control type="text" placeholder="Buscar..." />
        </Form>

        <div className="iconos"> 
          <Link to="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
          <Link>
            <Link to="/carrito">
              <Button>Carrito</Button>
            </Link>
          </Link>
          
        </div>
      </div>

      <nav className="navegacion">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/categorias">Categorías</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/ofertas">Ofertas</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
        <Button className="btn-tiendas">Tiendas/Eventos</Button>
      </nav>
    </header>
  );
}

export default AppNavbar;