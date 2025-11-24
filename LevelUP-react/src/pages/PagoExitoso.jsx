import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Spinner, ListGroup } from 'react-bootstrap';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import client from '../api/axiosClient';
import '../styles/pago-resultado.css'; 

const PagoExitoso = () => {
  const { ordenId } = useParams();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrden = async () => {
      try {
        // Intentamos obtener el detalle de la boleta recién creada
        const response = await client.get(`/ventas/${ordenId}`);
        setOrden(response.data);
      } catch (err) {
        console.warn("No se pudo cargar el detalle de la orden (puede ser restricción de seguridad):", err);
        // No seteamos error fatal, simplemente mostramos el mensaje genérico de éxito
      } finally {
        setLoading(false);
      }
    };

    if (ordenId) {
      fetchOrden();
    }
  }, [ordenId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <Spinner animation="border" variant="success" />
        <span className="ms-3">Procesando tu comprobante...</span>
      </div>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className="text-center p-4 shadow-lg bg-dark text-white border-success" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="mb-4">
          <FaCheckCircle size={80} className="text-success" />
        </div>
        
        <h2 className="mb-3 text-success fw-bold">¡Compra Realizada con Éxito!</h2>
        <p className="mb-4 text-light">
          Tu orden <strong>#{ordenId}</strong> ha sido registrada correctamente.
          Gracias por preferir Level-Up Gamer.
        </p>

        {/* Si logramos traer la orden, mostramos el detalle. Si no, solo el mensaje de éxito. */}
        {orden && (
          <Card className="bg-secondary text-white border-0 mb-4 text-start shadow-sm">
            <Card.Body>
              <h5 className="border-bottom pb-2 mb-3">Resumen de tu compra</h5>
              
              <ListGroup variant="flush" className="rounded mb-3">
                {orden.detalles?.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center bg-dark text-white border-secondary py-2">
                    <div>
                      <span className="fw-bold">{item.producto?.nombre}</span>
                      <div className="text-muted small" style={{fontSize: '0.85em'}}>Cantidad: {item.cantidad}</div>
                    </div>
                    <span>${(item.precioUnitario * item.cantidad).toLocaleString('es-CL')}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary">
                <span className="h5 mb-0">Total Pagado:</span>
                <span className="h3 text-success mb-0 fw-bold">${orden.total?.toLocaleString('es-CL')}</span>
              </div>
            </Card.Body>
          </Card>
        )}

        <div className="d-grid gap-2 mt-3">
          <Button as={Link} to="/productos" variant="primary" size="lg" className="btn-gamer fw-bold">
            <FaShoppingBag className="me-2 mb-1" /> Volver a la Tienda
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default PagoExitoso;