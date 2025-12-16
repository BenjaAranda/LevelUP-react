import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import client from '../api/axiosClient';
import { FaSave, FaArrowLeft, FaUserEdit } from 'react-icons/fa';
import '../styles/editUsuario.css';

const EditarUsuario = () => {
  // Captura el ID de la URL (definido en App.jsx como /:id)
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para los inputs
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [rol, setRol] = useState('');
  const [descuento, setDescuento] = useState(false);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch de datos al cargar
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await client.get(`/users/${id}`);
        const data = response.data;
        
        setUsuario(data);
        setNombre(data.nombre);
        setEmail(data.email);
        setEdad(data.edad);
        setRol(data.role); 
        setDescuento(data.descuento);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el usuario. Verifica conexión.');
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  // 2. Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    const edadNumero = Number(edad);
    if (!nombre.trim() || !edad || isNaN(edadNumero) || edadNumero < 18) {
      setError('Nombre requerido y edad válida (+18).');
      return;
    }

    try {
      await client.put(`/users/${id}`, {
        nombre: nombre,
        edad: edadNumero,
        role: rol
      });

      setMensaje('¡Usuario actualizado correctamente!');
      
      // Redirigir tras 1.5 seg
      setTimeout(() => {
        navigate('/admin/gestionar-usuarios');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Error al guardar los cambios.');
    }
  };

  if (loading) return (
    <Container className="gamer-edit-container text-center pt-5">
       <Spinner animation="border" variant="info" /> <span className="text-white ms-2">Cargando datos...</span>
    </Container>
  );

  return (
    <Container className="gamer-edit-container">
      <div className="gamer-card-frame">
        
        {/* Cabecera */}
        <div className="gamer-card-header">
          <FaUserEdit className="header-icon" /> 
          <h2>EDITAR: <span className="neon-text-green">{usuario?.nombre?.toUpperCase()}</span></h2>
        </div>

        <Card.Body className="gamer-card-body">
          <Link to="/admin/gestionar-usuarios" className="back-link">
            <Button variant="outline-light" className="btn-back">
               <FaArrowLeft /> Volver
            </Button>
          </Link>

          {error && <Alert variant="danger" className="gamer-alert error">{error}</Alert>}
          {mensaje && <Alert variant="success" className="gamer-alert success">{mensaje}</Alert>}

          <Form onSubmit={handleSubmit} className="gamer-form">
            
            {/* EMAIL (Bloqueado) */}
            <Form.Group className="mb-4">
              <Form.Label className="gamer-label">Email (ID Sistema)</Form.Label>
              <div className="input-wrapper locked">
                 <Form.Control type="email" value={email} disabled className="gamer-input disabled" />
                 <span className="lock-badge">BLOQUEADO</span>
              </div>
            </Form.Group>

            {/* NOMBRE */}
            <Form.Group className="mb-4">
              <Form.Label className="gamer-label">Nombre</Form.Label>
              <Form.Control 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                className="gamer-input"
                required
              />
            </Form.Group>

            {/* EDAD */}
            <Form.Group className="mb-4">
              <Form.Label className="gamer-label">Edad</Form.Label>
              <Form.Control 
                type="number" 
                min="18"
                value={edad} 
                onChange={(e) => setEdad(e.target.value)}
                className="gamer-input"
                required
              />
            </Form.Group>

            {/* ROL (Select) */}
            <Form.Group className="mb-4">
              <Form.Label className="gamer-label">Rol / Permisos</Form.Label>
              <Form.Select 
                value={rol} 
                onChange={(e) => setRol(e.target.value)}
                className="gamer-input select"
              >
                <option value="CLIENTE">CLIENTE</option>
                <option value="VENDEDOR">VENDEDOR</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>

            {/* Descuento (Visual) */}
            <Form.Group className="mb-5">
              <Form.Label className="gamer-label">Descuento DUOC</Form.Label>
               <div className="input-wrapper locked">
                 <Form.Control 
                    type="text" 
                    value={descuento ? "ACTIVO" : "INACTIVO"} 
                    disabled 
                    className={`gamer-input disabled ${descuento ? 'text-success' : 'text-secondary'}`} 
                 />
              </div>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="btn-save-gamer">
                 <FaSave /> GUARDAR CAMBIOS
              </Button>
            </div>

          </Form>
        </Card.Body>
      </div>
    </Container>
  );
};

export default EditarUsuario;