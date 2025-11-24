import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCart } from '../hooks/useCart.jsx';
import '../styles/checkout.css'; 
import { regionesComunas } from '../data/chile-regiones-comunas.js'; // Data estática OK
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const Checkout = () => {
  const { usuario } = useAuth();
  const { carritoItems, totalPrecio, finalizarCompraYActualizarStock } = useCart();
  const navigate = useNavigate();
  
  useGoBackOnEsc();

  // Estados
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rut, setRut] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [departamento, setDepartamento] = useState('');
  
  const [region, setRegion] = useState('Metropolitana de Santiago');
  const [comuna, setComuna] = useState('');
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  const [codigoPostal, setCodigoPostal] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setCorreo(usuario.email || '');
    }
  }, [usuario]); 

  useEffect(() => {
    if (carritoItems.length === 0 && !isProcessing) {
      navigate('/carrito');
    }
  }, [carritoItems, navigate, isProcessing]);

  useEffect(() => {
    if (region && regionesComunas[region]) {
      const comunasDeRegion = regionesComunas[region];
      setComunasDisponibles(comunasDeRegion);
      setComuna(comunasDeRegion[0]);
    } else {
      setComunasDisponibles([]);
      setComuna('');
    }
  }, [region]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!nombre || !apellidos || !correo || !telefono || !rut || !calle || !numero || !region || !comuna) {
      setError('Por favor, completa todos los campos obligatorios (*).');
      return;
    }
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]$/;
    if (!rutRegex.test(rut)) {
        setError('Formato de RUT inválido. (Ej: 12345678-9)');
        return;
    }
    
    setIsProcessing(true); 
    
    const direccionEnvio = {
        nombre, apellidos, correo, telefono, rut,
        calle, numero, departamento, region, comuna, codigoPostal, indicaciones
    };
    
    // Llamada ASÍNCRONA al Provider (que llama al Backend)
    const { exito, ordenId } = await finalizarCompraYActualizarStock(direccionEnvio); 
    
    if (exito) {
      navigate(`/pago-exitoso/${ordenId}`);
    } else {
      // Si falla, mostramos error
      setError('Error al procesar el pago. Intente nuevamente.');
      setIsProcessing(false); 
    }
  };

  return (
    <Container className="checkout-container">
      <Form onSubmit={handleSubmit} className="checkout-form">
        <Row>
          <Col md={7}>
            <div className="checkout-card">
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              
              <h2>Información del cliente</h2>
               <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="apellidos">
                    <Form.Label>Apellidos *</Form.Label>
                    <Form.Control type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={7}>
                    <Form.Group className="mb-3" controlId="correo">
                        <Form.Label>Correo *</Form.Label>
                        <Form.Control type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                    </Form.Group>
                </Col>
                 <Col md={5}>
                    <Form.Group className="mb-3" controlId="rut">
                        <Form.Label>RUT *</Form.Label>
                        <Form.Control type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12345678-9" required />
                    </Form.Group>
                </Col>
              </Row>
               <Form.Group className="mb-3" controlId="telefono">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 1234 5678" required />
              </Form.Group>


              <h2 className="mt-4">Dirección de entrega</h2>
              <Row>
                <Col md={8}>
                    <Form.Group className="mb-3" controlId="calle">
                        <Form.Label>Calle *</Form.Label>
                        <Form.Control type="text" value={calle} onChange={(e) => setCalle(e.target.value)} required />
                    </Form.Group>
                </Col>
                 <Col md={4}>
                    <Form.Group className="mb-3" controlId="numero">
                        <Form.Label>Número *</Form.Label>
                        <Form.Control type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required />
                    </Form.Group>
                </Col>
              </Row>
                <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="departamento">
                        <Form.Label>Departamento (opcional)</Form.Label>
                        <Form.Control type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
                    </Form.Group>
                </Col>
                 <Col md={6}>
                    <Form.Group className="mb-3" controlId="codigoPostal">
                        <Form.Label>Código Postal (opcional)</Form.Label>
                        <Form.Control type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="region">
                    <Form.Label>Región *</Form.Label>
                    <Form.Select 
                      value={region} 
                      onChange={(e) => setRegion(e.target.value)}
                      required
                    >
                      {Object.keys(regionesComunas).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="comuna">
                    <Form.Label>Comuna *</Form.Label>
                    <Form.Select 
                      value={comuna} 
                      onChange={(e) => setComuna(e.target.value)} 
                      required 
                      disabled={comunasDisponibles.length === 0}
                    >
                      {comunasDisponibles.length === 0 ? (
                        <option value="" disabled>Selecciona una región</option>
                      ) : (
                        comunasDisponibles.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="indicaciones">
                <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
                <Form.Control as="textarea" rows={3} value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} placeholder="Ej: Casa con reja blanca, dejar en conserjería..." />
              </Form.Group>
            </div>
          </Col>

          <Col md={5}>
            <div className="checkout-resumen">
              <h2>Resumen del Carrito</h2>
              {carritoItems.length > 0 ? (
                carritoItems.map(item => (
                  <div key={item.codigo} className="checkout-resumen-item">
                    <span className="item-nombre">{item.nombre} (x{item.unidades})</span>
                    <span className="item-total">${(item.precio * item.unidades).toLocaleString('es-CL')}</span>
                  </div>
                ))
              ) : (
                <p>Tu carrito está vacío.</p>
              )}
              
              <div className="checkout-resumen-total">
                <span className="total-label">Total a pagar:</span>
                <span className="total-valor">${totalPrecio.toLocaleString('es-CL')}</span>
              </div>
              
              <Button 
                type="submit" 
                className="btn-pagar" 
                disabled={isProcessing || carritoItems.length === 0}
              >
                {isProcessing ? 'Procesando pago...' : `Pagar ahora $${totalPrecio.toLocaleString('es-CL')}`}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Checkout;