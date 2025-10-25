// En: src/pages/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth.jsx'; 
import '../styles/admin-login.css'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const adminEmail = "admin@levelup.com";
    const adminPass = "admin123";

    if (email === adminEmail && password === adminPass) {
      login({ email: adminEmail, nombre: "Admin", isAdmin: true }); 
      navigate('/admin/home'); 
    } else {
      setError('Credenciales de administrador incorrectas.');
    }
  };

  return (
    // --- AÑADIMOS id="admin-login-page" Y QUITAMOS my-5 ---
    <Container id="admin-login-page"> 
      <Row className="justify-content-center w-100"> {/* w-100 para que Row ocupe el ancho completo */}
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Acceso Administrador</h2>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3" controlId="adminEmail">
                  <Form.Label>Correo Administrador</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="adminPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit" variant="warning" className="w-100">Ingresar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;  