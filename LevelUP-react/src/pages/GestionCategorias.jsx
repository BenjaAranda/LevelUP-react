// En: src/pages/GestionCategorias.jsx (Con Edición)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Form, InputGroup, Alert } from 'react-bootstrap';
// Importamos la nueva función
import { getCategorias, agregarCategoria, eliminarCategoria, actualizarCategoria } from '../data/productos.js';
// Reutilizamos estilos
import '../styles/gestionDestacados.css';
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  
  useGoBackOnEsc();

  // --- NUEVOS ESTADOS PARA EDICIÓN ---
  const [editingCategory, setEditingCategory] = useState(null); // Guarda el nombre de la categoría que se está editando
  const [editedName, setEditedName] = useState(''); // Guarda el nuevo nombre en el input de edición

  // Cargar categorías al inicio
  useEffect(() => {
    setCategorias(getCategorias());
  }, []);

  const handleAgregar = (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!nuevaCategoria.trim()) {
      setError("El nombre de la categoría no puede estar vacío.");
      return;
    }
    try {
      const listaActualizada = agregarCategoria(nuevaCategoria);
      setCategorias(listaActualizada);
      setMensaje(`Categoría "${nuevaCategoria}" agregada.`);
      setNuevaCategoria('');
    } catch (err) {
      setError(err.message || 'Error al agregar la categoría.');
    }
  };

  const handleEliminar = (categoria) => {
    setError('');
    setMensaje('');
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria}"?`)) {
      try {
        // Opcional: Verificar si la categoría está en uso antes de eliminar
        // const productos = getProductos(); // Necesitarías importar getProductos
        // if (productos.some(p => p.categoria === categoria)) {
        //   setError(`No se puede eliminar "${categoria}" porque está asignada a productos.`);
        //   return;
        // }
        const listaActualizada = eliminarCategoria(categoria);
        setCategorias(listaActualizada);
        setMensaje(`Categoría "${categoria}" eliminada.`);
      } catch (err) {
        setError(err.message || 'Error al eliminar la categoría.');
      }
    }
  };

  // --- NUEVAS FUNCIONES PARA EDICIÓN ---
  // Se activa al hacer clic en "Editar"
  const handleEdit = (categoria) => {
    setEditingCategory(categoria); // Marca esta categoría como la que se está editando
    setEditedName(categoria); // Rellena el input de edición con el nombre actual
    setError(''); // Limpia errores
    setMensaje(''); // Limpia mensajes
  };

  // Se activa al hacer clic en "Guardar"
  const handleSaveEdit = (nombreViejo) => {
    setError('');
    setMensaje('');
    if (!editedName.trim()) {
      setError("El nuevo nombre no puede estar vacío.");
      return;
    }
    if (editedName.trim() === nombreViejo) {
      // Si no hubo cambios, simplemente cancela la edición
      handleCancelEdit();
      return;
    }

    try {
      const listaActualizada = actualizarCategoria(nombreViejo, editedName);
      setCategorias(listaActualizada);
      setMensaje(`Categoría "${nombreViejo}" actualizada a "${editedName}".`);
      handleCancelEdit(); // Sale del modo edición
    } catch (err) {
      setError(err.message || 'Error al actualizar la categoría.');
    }
  };

  // Se activa al hacer clic en "Cancelar" o después de guardar
  const handleCancelEdit = () => {
    setEditingCategory(null); // Desmarca la categoría como en edición
    setEditedName(''); // Limpia el input de edición
  };
  // --- FIN NUEVAS FUNCIONES ---

  return (
    <Container className="gestion-destacados-container my-5">
      <Card>
        <Card.Header as="h2">Gestionar Categorías</Card.Header>
        <Card.Body>
          <Link to="/admin/home">
            <Button variant="outline-secondary" className="mb-3">← Volver al Panel</Button>
          </Link>

          {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          {/* Formulario para agregar */}
          <Form onSubmit={handleAgregar} className="mb-4">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Nombre de la nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
              <Button variant="success" type="submit">
                ➕ Agregar
              </Button>
            </InputGroup>
          </Form>

          {/* Lista de categorías existentes */}
          <h3>Categorías Existentes</h3>
          <ListGroup className="lista-gestion">
            {categorias.length > 0 ? (
              categorias.map(cat => (
                <ListGroup.Item key={cat} className="item-gestion">
                  {/* --- VISTA CONDICIONAL: Mostramos input o nombre --- */}
                  {editingCategory === cat ? (
                    // --- MODO EDICIÓN ---
                    <>
                      <Form.Control
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        autoFocus // Pone el cursor en el input al editar
                        size="sm" // Input más pequeño
                      />
                      <Button variant="success" size="sm" onClick={() => handleSaveEdit(cat)}>✓ Guardar</Button>
                      <Button variant="secondary" size="sm" onClick={handleCancelEdit}>✕ Cancelar</Button>
                    </>
                  ) : (
                    // --- MODO VISUALIZACIÓN ---
                    <>
                      <span style={{ fontWeight: 'bold' }}>{cat}</span>
                      <div className="ms-auto"> {/* Empuja botones a la derecha */}
                         <Button variant="warning" size="sm" onClick={() => handleEdit(cat)} className="me-2 text-dark">✏️ Editar</Button>
                         <Button variant="danger" size="sm" onClick={() => handleEliminar(cat)}>🗑️ Eliminar</Button>
                      </div>
                    </>
                  )}
                  {/* --- FIN VISTA CONDICIONAL --- */}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No hay categorías definidas.</ListGroup.Item>
            )}
          </ListGroup>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default GestionCategorias;