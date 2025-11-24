import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useCart } from '../hooks/useCart.jsx';
import '../styles/carrito.css'; 
import { Button } from 'react-bootstrap'; 
import { useGoBackOnEsc } from '../hooks/useGoBackOnEsc';

const Carrito = () => {
  // Usamos los hooks tal como en tu versión original
  const cartContext = useCart();
  const navigate = useNavigate();
  
  // Extraemos valores con fallback seguro
  const carritoItems = cartContext?.carritoItems || [];
  const totalPrecio = cartContext?.totalPrecio || 0;
  
  useGoBackOnEsc();

  const {
    restarDelCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
  } = cartContext || {};

  return (
    <div className="contenedor-carrito">
      <h1>Tu Canasta</h1>

      <div id="listaCarrito">
        {carritoItems.length === 0 ? (
          <div className="carrito-vacio">
             <p>Tu carrito está vacío.</p>
             <Button className="btn-finalizar" onClick={() => navigate('/productos')}>
                Ir a la Tienda
             </Button>
          </div>
        ) : (
          carritoItems.map((producto) => {
            if (!producto || !producto.codigo) return null;

            // LÓGICA CORREGIDA DE IMAGEN (Para que se vea siempre)
            // Busca 'img' (legacy), 'imagen' (backend) o placeholder
            const imagenSrc = producto.img || producto.imagen || 'https://placehold.co/100x100?text=Sin+Imagen';

            return (
              <div key={producto.codigo} className="item-carrito">
                <div className="item-carrito-info">
                  
                  {/* Contenedor de imagen original */}
                  <div className="item-carrito-imagen">
                    <img src={imagenSrc} alt={producto.nombre} />
                  </div>
                  
                  <div className="item-carrito-detalles">
                    <h3>{producto.nombre || 'Nombre no disponible'}</h3>
                    
                    {/* Sección de Unidades y Botones */}
                    <p>
                      <span className="texto-label">Unidades:</span>
                      <span className="texto-valor">{producto.unidades || producto.cantidad || 0}</span>
                      
                      {agregarAlCarrito && (
                        <button 
                          className="btn-carrito accion" 
                          onClick={() => agregarAlCarrito(producto)}
                          title="Agregar uno"
                        >
                          ➕
                        </button>
                      )}
                      {restarDelCarrito && (
                        <button 
                          className="btn-carrito accion" 
                          onClick={() => restarDelCarrito(producto.codigo)}
                          title="Quitar uno"
                        >
                          ➖
                        </button>
                      )}
                      {eliminarDelCarrito && (
                        <button 
                          className="btn-carrito eliminar" 
                          onClick={() => eliminarDelCarrito(producto.codigo)}
                          title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      )}
                    </p>

                    {/* Precios */}
                    <p>
                      <span className="texto-label">Precio Unitario:</span>
                      <span className="texto-valor">${(producto.precio || 0).toLocaleString('es-CL')}</span>
                    </p>
                    <p>
                      <span className="texto-label">Subtotal:</span>
                      <span className="texto-valor">
                        ${((producto.unidades || producto.cantidad || 0) * (producto.precio || 0)).toLocaleString('es-CL')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botón Vaciar Carrito */}
      {carritoItems.length > 0 && vaciarCarrito && (
        <div className="acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito}>
            Vaciar Carrito
          </button>
        </div>
      )}

      {/* Resumen y Checkout */}
      <div className="resumen">
        <h2>
          <span className="texto-label">Total: </span>
          <span className="texto-valor">
            $ {totalPrecio.toLocaleString('es-CL')}
          </span>
        </h2>
        
        <Button
          className="btn-finalizar"
          onClick={() => navigate('/checkout')}
          disabled={carritoItems.length === 0}
          style={carritoItems.length === 0 ? { pointerEvents: 'none', opacity: 0.5 } : {}}
        >
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
};

export default Carrito;