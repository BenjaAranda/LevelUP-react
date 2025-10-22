// En: src/pages/Home.jsx
import React from 'react';
import { Container } from 'react-bootstrap'; // Usamos Container para centrar el contenido

function Home() {
  return (
    <Container>
      <div className="text-center"> {/* Clases de Bootstrap para centrar texto */}
        <h1 className="titulo-seccion" style={{ color: '#8000ff' }}>¡Bienvenido a LevelUP!</h1>
        <p style={{ color: 'white' }}>
          La migración a React está en proceso. Ya tienes tu Navbar y tu primera página funcionando.
        </p>
      </div>
    </Container>
  );
}

export default Home;