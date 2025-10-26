import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/verProductosAdmin.css';

const GestionOrdenesNuevo = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);

  useEffect(() => {
    const mockOrdenes = [
      {
        id: "ORD001",
        fecha: "2023-10-26",
        cliente: {
          nombre: "Usuario Test",
          email: "test@test.com"
        },
        productos: [
          {
            nombre: "Catan",
            cantidad: 1,
            precio: 29990
          }
        ],
        estado: "Pendiente",
        total: 29990
      },
      {
        id: "ORD002",
        fecha: "2023-10-26",
        cliente: {
          nombre: "Usuario Test 2",
          email: "test2@test.com"
        },
        productos: [
          {
            nombre: "Monopoly",
            cantidad: 2,
            precio: 24990
          }
        ],
        estado: "Enviado",
        total: 49980
      }
    ];
    setOrdenes(mockOrdenes);
  }, []);

  const ordenesFiltradas = filtroEstado
    ? ordenes.filter(orden => orden.estado === filtroEstado)
    : ordenes;

  const handleEstadoChange = (ordenId, nuevoEstado) => {
    setOrdenes(ordenes.map(orden =>
      orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
    ));
  };

  const verDetalles = (orden) => {
    setOrdenSeleccionada(orden);
    setShowDetalles(true);
  };

  return (
    <Container className="ver-productos-admin-container my-5">
      <Card>
        <Card.Header>
          <h2>Gestionar Órdenes Recibidas</h2>
        </Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">
              ← Volver al Panel
            </Button>
          </Link>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="filtroEstado">Filtrar por estado</Form.Label>
            <Form.Select
              id="filtroEstado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
            </Form.Select>
          </Form.Group>

          <div className="table-responsive">
            <Table striped bordered hover variant="dark" className="mt-3 align-middle">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Fecha y Hora</th>
                  <th>Usuario (Email)</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.length > 0 ? (
                  ordenesFiltradas.map(orden => (
                    <tr key={orden.id}>
                      <td>{orden.id}</td>
                      <td>{orden.fecha}</td>
                      <td>{orden.cliente.email}</td>
                      <td>
                        <Form.Select
                          value={orden.estado}
                          onChange={(e) => handleEstadoChange(orden.id, e.target.value)}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregado">Entregado</option>
                        </Form.Select>
                      </td>
                      <td>${orden.total.toLocaleString()}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => verDetalles(orden)}
                        >
                          Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center fst-italic text-muted">
                      No hay órdenes registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showDetalles} onHide={() => setShowDetalles(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Orden {ordenSeleccionada?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ordenSeleccionada && (
            <>
              <h5>Información del Cliente</h5>
              <p>Nombre: {ordenSeleccionada.cliente.nombre}</p>
              <p>Email: {ordenSeleccionada.cliente.email}</p>

              <h5 className="mt-4">Productos</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenSeleccionada.productos.map((producto, index) => (
                    <tr key={index}>
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                      <td>${producto.precio.toLocaleString()}</td>
                      <td>${(producto.cantidad * producto.precio).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="mt-3 text-end">
                Total: ${ordenSeleccionada.total.toLocaleString()}
              </h5>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalles(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionOrdenesNuevo;