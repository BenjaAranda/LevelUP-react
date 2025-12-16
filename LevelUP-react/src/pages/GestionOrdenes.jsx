// src/pages/GestionOrdenes.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';
// Importamos el CSS nuevo
import '../styles/gestionOrdenes.css'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useGoBackOnEsc();

  // Función para cargar datos del BACKEND REAL
  const fetchOrdenes = async () => {
    setLoading(true);
    setError('');
    try {
      // Ajusta la URL si tu puerto no es 8080
      const response = await fetch('http://localhost:8080/api/v1/ventas');
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const data = await response.json();
      setOrdenes(data); // Guardamos la lista de Boletas que viene de Java

    } catch (e) {
      setError("No se pudieron cargar las órdenes. ¿El backend está encendido?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const formatFecha = (isoString) => {
    if (!isoString) return '-';
    try {
        const date = new Date(isoString);
        return date.toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch {
        return 'Fecha inválida';
    }
  };

  return (
    <Container className="gestion-ordenes-container my-5">
      <Card className="card-custom">
        <Card.Header>
          <h2 className="titulo-neon">
            GESTION DE <span className="highlight-green">ORDENES</span>
          </h2>
        </Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-light" className="btn-back mb-3">
              ← Volver al Panel
            </Button>
          </Link>

          {error && <Alert variant="danger" className="bg-dark text-danger border-danger">{error}</Alert>}

          {loading ? (
            <div className="text-center text-light">
                <div className="spinner-border text-success" role="status"></div>
                <p>Cargando datos del sistema...</p>
            </div>
          ) : (
            <Table responsive hover className="table-dark-custom mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th className="text-center">Cant. Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No hay ventas registradas en la Base de Datos.
                    </td>
                  </tr>
                ) : (
                  ordenes.map(orden => (
                    <tr key={orden.id}>
                      <td>#{orden.id}</td>
                      <td>{formatFecha(orden.fecha)}</td>
                      
                      {/* Accedemos al objeto usuario dentro de la boleta */}
                      <td className="text-email">
                        {orden.usuario ? orden.usuario.email : 'Usuario Eliminado'}
                      </td>

                      {/* Calculamos la cantidad sumando los detalles */}
                      <td className="text-center">
                        {orden.detalles ? orden.detalles.reduce((acc, det) => acc + det.cantidad, 0) : 0}
                      </td>

                      <td className="precio-total">
                        ${(orden.total || 0).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}

          <div className="d-flex justify-content-end mt-3">
             <Button variant="outline-success" size="sm" onClick={fetchOrdenes}>
                Actualizar Lista ↻
             </Button>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default GestionOrdenes;