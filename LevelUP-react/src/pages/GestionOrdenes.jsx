// En: src/pages/GestionOrdenes.jsx (Versión Mejorada)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Button, Alert, Badge } from 'react-bootstrap';
// Importamos la función para obtener órdenes
import { getOrdenes } from '../data/ordenes.js'; // Asegúrate que la ruta sea correcta
// Reutilizamos estilos de tabla
import '../styles/verProductosAdmin.css'; 
// Podríamos añadir estilos específicos si es necesario
// import '../styles/gestionOrdenes.css'; 

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar órdenes al inicio
  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      setOrdenes(getOrdenes()); // getOrdenes ya las devuelve ordenadas
    } catch (e) {
      setError("Error al cargar las órdenes.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para formatear la fecha de manera más legible
  const formatFecha = (isoString) => {
    try {
        const date = new Date(isoString);
        // Formato: DD/MM/YYYY HH:MM
        return date.toLocaleString('es-CL', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false // Formato 24h si se prefiere
        });
    } catch {
        return 'Fecha inválida';
    }
  };

  return (
    <Container className="ver-productos-admin-container my-5"> {/* Reutiliza clase */}
      <Card>
        <Card.Header as="h2">Gestionar Órdenes Recibidas</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>

          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <Alert variant="info">Cargando órdenes...</Alert>
          ) : (
            <Table responsive striped bordered hover variant="dark" className="mt-3 align-middle"> {/* align-middle para centrar verticalmente */}
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Fecha y Hora</th>
                  <th>Usuario (Email)</th>
                  <th>Nº Productos</th>
                  <th>Total Compra</th>
                  {/* Podríamos añadir Estado (Pendiente, Enviado, etc.) en el futuro */}
                  {/* <th>Estado</th> */} 
                  {/* Podríamos añadir un botón Ver Detalle en el futuro */}
                  {/* <th>Acciones</th> */} 
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 ? (
                  <tr>
                    {/* Ajustamos colSpan */}
                    <td colSpan="5" className="text-center fst-italic text-muted">No hay órdenes registradas.</td> 
                  </tr>
                ) : (
                  ordenes.map(orden => (
                    <tr key={orden.id}>
                      {/* ID como texto pequeño y gris */}
                      <td><small className="text-muted">{orden.id}</small></td> 
                      <td>{formatFecha(orden.fecha)}</td>
                      <td>{orden.usuarioEmail}</td>
                      <td className="text-center">
                        {/* Calculamos el número total de unidades */}
                        {orden.items.reduce((acc, item) => acc + (item.unidades || 0), 0)} 
                      </td>
                      {/* Total formateado y en negrita */}
                      <td className="fw-bold">${(orden.total || 0).toLocaleString('es-CL')}</td> 
                      {/* <td><Badge bg="success">Completada</Badge></td> */} 
                      {/* <td><Button size="sm" variant="info">Ver Detalle</Button></td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GestionOrdenes;