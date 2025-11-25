import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth.jsx'; 
import '../styles/admin-login.css'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import BotonVolver from '../components/BotonVolver';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras carga
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Esta función debe venir de tu AuthProvider actualizado
  
  useGoBackOnEsc();

  const handleSubmit = async (e) => { // <--- Convertimos a ASYNC
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Llamamos al Login real del backend (ya no usamos datos falsos)
      // Asegúrate de haber actualizado el AuthProvider como te dije en el paso anterior
      const result = await login(email, password);

      if (result.success) {
        // 2. Verificamos si el usuario que acaba de entrar es ADMIN
        // Obtenemos el usuario guardado en localStorage
        const userStored = JSON.parse(localStorage.getItem('user'));

        if (userStored && userStored.role === 'ADMIN') {
           // ES ADMIN: Bienvenido
           navigate('/admin/home'); 
        } else {
           // NO ES ADMIN: Fuera de aquí
           setError('Tu usuario existe, pero NO tienes permisos de Administrador.');
           // Opcional: Cerrar sesión inmediatamente si no es admin
           localStorage.removeItem('token');
           localStorage.removeItem('user');
        }
      } else {
        // Error de contraseña o correo incorrecto desde el backend
        setError('Credenciales incorrectas.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al intentar conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container id="admin-login-page"> 
      <Row className="justify-content-center w-100"> 
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <BotonVolver />
              <h2 className="text-center mb-4">Acceso Administrador</h2>
              
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form.Group className="mb-3" controlId="adminEmail">
                  <Form.Label>Correo Administrador</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="adminPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Button 
                    type="submit" 
                    variant="warning" 
                    className="w-100" 
                    disabled={loading} // Evita doble click
                >
                    {loading ? 'Verificando...' : 'Ingresar'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;