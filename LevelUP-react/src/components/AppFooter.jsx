// En: src/components/AppFooter.jsx

import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AppFooter() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-contenido">
          {/* Sección de Logo y Links */}
          <div className="footer-logo">
            <img src="/img/logo.png" alt="LevelUP Logo" />
            <div className="footer-links">
              <ul>
                <li><Link to="/nosotros">Sobre Nosotros</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
                <li><Link to="/terminos">Términos y Condiciones</Link></li>
              </ul>
            </div>
          </div>

          {/* Sección Social y Newsletter */}
          <div className="footer-social">
            <h5>Síguenos</h5>
            <a href="#">Facebook</a> | 
            <a href="#">Twitter</a> | 
            <a href="#">Instagram</a>
            <div className="footer-newsletter mt-3">
              <h5>Suscríbete a nuestro Newsletter</h5>
              <Form>
                <Form.Control type="email" placeholder="Ingresa tu email" className="mb-2" />
                <Button variant="primary" type="submit">Suscribirse</Button>
              </Form>
            </div>
          </div>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} LevelUP Store. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}

export default AppFooter;