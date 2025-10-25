// En: src/pages/VerProductosAdmin.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. IMPORTAMOS Table y InputGroup de react-bootstrap
import { Container, Card, Button, Form, InputGroup, Alert, Table } from 'react-bootstrap'; 
import '../styles/verProductosAdmin.css'; // Asegúrate que el CSS esté importado

const VerProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(''); 

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(productosGuardados);
  }, []);

  const handleStockChange = (codigo, nuevoStock) => {
    const stockNum = Math.max(0, Number(nuevoStock));
    setProductos(prevProductos =>
      prevProductos.map(p =>
        p.codigo === codigo ? { ...p, stock: stockNum } : p
      )
    );
  };

  const handleGuardarStock = (codigo) => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const productoActualizado = productos.find(p => p.codigo === codigo);
    if (!productoActualizado) return;
    const nuevaListaGuardada = productosGuardados.map(p =>
      p.codigo === codigo ? productoActualizado : p
    );
    localStorage.setItem("productos", JSON.stringify(nuevaListaGuardada));
    setMensaje(`Stock de "${productoActualizado.nombre}" actualizado a ${productoActualizado.stock}.`);
    setTimeout(() => setMensaje(''), 3000);
  };
  
  // --- FUNCIÓN PARA ELIMINAR (NUEVO) ---
  const handleEliminarProducto = (codigo) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
          const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
          const nuevaLista = productosGuardados.filter(p => p.codigo !== codigo);
          localStorage.setItem("productos", JSON.stringify(nuevaLista));
          setProductos(nuevaLista); // Actualiza el estado local
          setMensaje(`Producto con código "${codigo}" eliminado.`);
          setTimeout(() => setMensaje(''), 3000);
      }
  };

  return (
    // --- CLASE AÑADIDA AQUÍ ---
    <Container className="ver-productos-admin-container my-5"> 
      <Card>
        <Card.Header as="h2">Gestionar Productos</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>
          
          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          
          {/* 2. USAMOS LA TABLA RESPONSIVA DE BOOTSTRAP */}
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
                <tr>
                  <td colSpan="7" className="text-center">No hay productos para mostrar.</td>
                </tr>
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
                          type="number"
                          min="0"
                          value={prod.stock}
                          onChange={(e) => handleStockChange(prod.codigo, e.target.value)}
                          style={{ maxWidth: '80px' }} // Ancho más pequeño
                        />
                        <Button variant="outline-success" onClick={() => handleGuardarStock(prod.codigo)}>
                          ✓ {/* Icono simple guardar */}
                        </Button>
                      </InputGroup>
                    </td>
                    <td className="admin-producto-acciones">
                       {/* Botón Editar (lleva a una futura página de edición) */}
                       <Link to={`/admin/editar-producto/${prod.codigo}`}>
                           <Button variant="warning" size="sm">✏️</Button>
                       </Link>
                       {/* Botón Eliminar */}
                       <Button variant="danger" size="sm" onClick={() => handleEliminarProducto(prod.codigo)}>🗑️</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {/* --- FIN TABLA --- */}
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerProductosAdmin;