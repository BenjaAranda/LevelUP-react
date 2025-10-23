// En: src/components/AppFooter.jsx

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AppFooter() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-contenido">
          
          {/* --- Sección de Logo y Links (Corregida) --- */}
          <div className="footer-logo">
            {/* 1. Imagen del logo (usando la de tu captura) */}
            <img src="/logo_main.png" alt="LevelUP Gamer Logo" />
            
            <div className="footer-links">
              <h5>Navegación Principal</h5>
              <ul>
                {/* 2. Links corregidos para coincidir con tu barra de navegación */}
                <li><Link to="/">Home</Link></li>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
          </div>

          {/* --- Sección Social y Sistema de Puntos --- */}
          <div className="footer-social">
            <h5>Síguenos</h5>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | 
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            
            <div className="footer-newsletter mt-3">
              <h5>Sistema de Puntos</h5>
              <p style={{marginBottom: '10px'}}>Inicia sesión y acumula puntos.</p>
              
              {/* Este botón dirige a /login, que es la página que mostrará el inicio de sesión */}
              <Button 
                as={Link} 
                to="/login" 
                style={{
                  backgroundColor: '#7d00d7', // Color morado de tu tema
                  borderColor: '#7d00d7',
                  fontWeight: 'bold',
                  borderRadius: '50px',       // Estilo redondeado
                  transition: '0.3s'
                }}
                // Efecto hover
                onMouseOver={(e) => e.target.style.backgroundColor = '#62017a'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#7d00d7'}
              >
                Presiona aquí
              </Button>
            </div>
          </div>
        </div>

        <div className="footer-copy">
          &copy; {new Date().getFullYear()} LevelUP Gamer. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}

export default AppFooter;