import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import '../styles/carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart, 
    removeOne, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    totalAmount,
    finalizarCompraYActualizarStock // <-- Traemos la nueva función
  } = useCart();

  // --- Manejador para el botón Finalizar Compra ---
  const handleFinalizarCompra = async () => {
    // Verificar si el usuario está autenticado
    if (!user) {
      navigate('/login');
      return;
    }
    
    const exito = await finalizarCompraYActualizarStock();
    if (exito) {
      navigate('/confirmacion-orden');
    }
  };

  return (
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      <div id="listaCarrito">
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          cart.map((producto) => (
            <div key={producto.codigo} className="item-carrito">
              <h3>{producto.nombre}</h3>
              <p>
                <span className="texto-label">Unidades:</span>
                <span className="texto-valor">{producto.cantidad}</span> 
                <button className="btn-carrito accion" onClick={() => addToCart(producto)}>➕</button>
                <button className="btn-carrito accion" onClick={() => removeOne(producto.codigo)}>➖</button>
                <button className="btn-carrito eliminar" onClick={() => removeFromCart(producto.codigo)}>🗑️</button>
              </p>
              <p>
                <span className="texto-label">Precio Unitario:</span>
                <span className="texto-valor">${producto.precio.toLocaleString('es-CL')}</span>
              </p>
              <p>
                <span className="texto-label">Subtotal:</span>
                <span className="texto-valor">${(producto.cantidad * producto.precio).toLocaleString('es-CL')}</span> 
              </p>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="acciones">
          <button className="btn-vaciar" onClick={clearCart}>Vaciar Carrito</button>
        </div>
      )}

      <div className="resumen">
        <h2>
          <span className="texto-label">Total:</span>
          <span className="texto-valor">${totalAmount.toLocaleString('es-CL')}</span>
        </h2>
        <button 
          className="btn-finalizar"
          onClick={handleFinalizarCompra}
          disabled={cart.length === 0}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Carrito;