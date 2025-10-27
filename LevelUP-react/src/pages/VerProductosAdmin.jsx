// En: src/pages/VerProductosAdmin.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button, Form, InputGroup, Alert, Table } from 'react-bootstrap'; 
// 1. IMPORTAMOS LAS FUNCIONES CRUD
import { getProductos, actualizarProducto, eliminarProducto } from '../data/productos.js'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';
import '../styles/verProductosAdmin.css'; 

const VerProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(''); 
  
  useGoBackOnEsc();

  // Cargar productos al inicio usando la función CRUD
  useEffect(() => {
    setProductos(getProductos());
  }, []);

  // Manejar cambio local de stock (igual)
  const handleStockChange = (codigo, nuevoStock) => {
    const stockNum = Math.max(0, Number(nuevoStock));
    setProductos(prevProductos =>
      prevProductos.map(p =>
        p.codigo === codigo ? { ...p, stock: stockNum } : p
      )
    );
  };

  // Guardar stock usando la función CRUD
  const handleGuardarStock = (codigo) => {
    const productoActualizado = productos.find(p => p.codigo === codigo);
    if (!productoActualizado) return; 

    try {
      actualizarProducto(productoActualizado); // Usamos la función CRUD
      setMensaje(`Stock de "${productoActualizado.nombre}" actualizado.`);
      setTimeout(() => setMensaje(''), 3000); 
    } catch (err) {
       setMensaje(`Error al guardar stock: ${err.message}`);
       // Opcional: Recargar los productos originales si falla el guardado
       // setProductos(getProductos()); 
    }
  };
  
  // Eliminar producto usando la función CRUD
  const handleEliminarProducto = (codigo, nombre) => {
      // 2. AÑADIMOS CONFIRMACIÓN
      if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
          try {
              const nuevaLista = eliminarProducto(codigo); // Usamos la función CRUD
              setProductos(nuevaLista); // Actualiza el estado local con la nueva lista
              setMensaje(`Producto "${nombre}" eliminado.`);
              setTimeout(() => setMensaje(''), 3000);
          } catch (err) {
              setMensaje(`Error al eliminar: ${err.message}`);
          }
      }
  };

  return (
    <Container className="ver-productos-admin-container my-5"> 
      <Card>
        <Card.Header as="h2">Gestionar Productos</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>
          
          {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}
          
          <Table responsive striped bordered hover variant="dark" className="mt-3">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Código (SKU)</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No hay productos.</td></tr>
              ) : (
                productos.map(prod => (
                  <tr key={prod.codigo}>
                    <td>
                      <img src={prod.imagen || prod.img} alt={prod.nombre} className="admin-producto-img-tabla" />
                    </td>
                    <td>{prod.nombre}</td>
                    <td>{prod.codigo}</td>
                    <td>{prod.categoria}</td>
                    <td>${prod.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <InputGroup size="sm">
                        <Form.Control
                          type="number" min="0" value={prod.stock}
                          onChange={(e) => handleStockChange(prod.codigo, e.target.value)}
                          style={{ maxWidth: '80px' }}
                        />
                        <Button variant="outline-success" onClick={() => handleGuardarStock(prod.codigo)}>✓</Button>
                      </InputGroup>
                    </td>
                    <td className="admin-producto-acciones">
                       {/* 3. CORREGIMOS EL LINK DE EDICIÓN */}
                       <Link to={`/admin/editar-producto/${prod.codigo}`}>
                           <Button variant="warning" size="sm" title="Editar">✏️</Button>
                       </Link>
                       {/* 4. PASAMOS EL NOMBRE PARA LA CONFIRMACIÓN */}
                       <Button variant="danger" size="sm" title="Eliminar" onClick={() => handleEliminarProducto(prod.codigo, prod.nombre)}>🗑️</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerProductosAdmin;