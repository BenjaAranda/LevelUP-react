// En: src/pages/GestionOrdenes.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// --- ¡CORRECCIÓN! ---
// Importamos Alert junto con los otros componentes de react-bootstrap
import { Container, Card, Table, Button, Alert, Badge } from 'react-bootstrap';
// --- FIN CORRECCIÓN ---
import { getOrdenes } from '../data/ordenes.js';
import '../styles/verProductosAdmin.css';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useGoBackOnEsc();

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      setOrdenes(getOrdenes());
    } catch (e) {
      setError("Error al cargar las órdenes.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatFecha = (isoString) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch {
        return 'Fecha inválida';
    }
  };

  return (
    <Container className="ver-productos-admin-container my-5">
      <Card>
        <Card.Header as="h2">Gestionar Órdenes Recibidas</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>

          {/* Ahora Alert está definido y debería funcionar */}
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Alert variant="info">Cargando órdenes...</Alert>
          ) : (
            <Table responsive striped bordered hover variant="dark" className="mt-3 align-middle">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Fecha y Hora</th>
                  <th>Usuario (Email)</th>
                  <th>Nº Productos</th>
                  <th>Total Compra</th>
                  {/* <th>Estado</th> */}
                  {/* <th>Acciones</th> */}
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center fst-italic text-muted">No hay órdenes registradas.</td>
                  </tr>
                ) : (
                  ordenes.map(orden => (
                    <tr key={orden.id}>
                      <td><small className="text-muted">{orden.id}</small></td>
                      <td>{formatFecha(orden.fecha)}</td>
                      <td>{orden.usuarioEmail}</td>
                      <td className="text-center">
                        {orden.items.reduce((acc, item) => acc + (item.unidades || 0), 0)}
                      </td>
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