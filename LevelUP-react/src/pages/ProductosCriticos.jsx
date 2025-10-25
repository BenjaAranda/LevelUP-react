// En: src/pages/ProductosCriticos.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Alert, Button } from 'react-bootstrap';
// Importamos la función para obtener productos
import { getProductos } from '../data/productos.js';
// Reutilizamos estilos de VerProductosAdmin si aplican, o creamos nuevos
import '../styles/verProductosAdmin.css'; // Reutilizamos estilos de tabla

const UMBRAL_STOCK_CRITICO = 5; // Define qué se considera "bajo stock"

const ProductosCriticos = () => {
  const [productosCriticos, setProductosCriticos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const todos = getProductos();
      const criticos = todos.filter(p => p.stock <= UMBRAL_STOCK_CRITICO);
      setProductosCriticos(criticos.sort((a, b) => a.stock - b.stock)); // Ordenar por stock ascendente
    } catch (error) {
      console.error("Error cargando productos:", error);
      // Podrías añadir un estado de error aquí
    } finally {
      setLoading(false);
    }
  }, []); // Se ejecuta solo al montar

  return (
    // Reutilizamos el contenedor de VerProductosAdmin
    <Container className="ver-productos-admin-container my-5"> 
      <Card>
        <Card.Header as="h2">Productos con Stock Crítico (≤ {UMBRAL_STOCK_CRITICO} unidades)</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>

          {loading ? (
            <Alert variant="info">Cargando productos...</Alert>
          ) : (
            <Table responsive striped bordered hover variant="dark" className="mt-3">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Código (SKU)</th>
                  <th className="text-danger">Stock Actual</th> {/* Resaltar stock */}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosCriticos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No hay productos con stock crítico.</td>
                  </tr>
                ) : (
                  productosCriticos.map(prod => (
                    <tr key={prod.codigo}>
                      <td>
                        <img src={prod.imagen || prod.img} alt={prod.nombre} className="admin-producto-img-tabla" />
                      </td>
                      <td>{prod.nombre}</td>
                      <td>{prod.codigo}</td>
                      <td className="text-danger fw-bold">{prod.stock}</td> {/* Resaltar stock */}
                      <td className="admin-producto-acciones">
                         {/* Link para editar y reponer stock */}
                         <Link to={`/admin/editar-producto/${prod.codigo}`}>
                             <Button variant="warning" size="sm" title="Editar/Reponer Stock">✏️</Button>
                         </Link>
                      </td>
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

export default ProductosCriticos;