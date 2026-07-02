import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerCarrito, actualizarCantidad, eliminarDelCarrito } from '../servicios/carrito';
import { useCarritoStore } from '../store/carrito';
import { formatearPrecio, esUrlSegura } from '../utilidades/seguridad';
import styles from './Carrito.module.css';

export default function Carrito() {
  const { items, establecerItems, totalPrecio } = useCarritoStore();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState<string | null>(null);
  const navigate = useNavigate();

  const cargarCarrito = () => {
    setCargando(true);
    obtenerCarrito()
      .then(establecerItems)
      .catch(() => setError('No se pudo cargar el carrito'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cambiarCantidad = async (itemId: string, nuevaCantidad: number, stock: number) => {
    if (nuevaCantidad < 1) return;
    setProcesando(itemId);
    setError('');
    try {
      await actualizarCantidad(itemId, nuevaCantidad, stock);
      cargarCarrito();
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar la cantidad');
    } finally {
      setProcesando(null);
    }
  };

  const eliminar = async (itemId: string) => {
    setProcesando(itemId);
    try {
      await eliminarDelCarrito(itemId);
      cargarCarrito();
    } catch {
      setError('No se pudo eliminar el producto');
    } finally {
      setProcesando(null);
    }
  };

  if (cargando) return <div className={styles.estado}>Cargando carrito...</div>;

  if (items.length === 0) {
    return (
      <div className={`contenedor ${styles.vacio}`}>
        <p className={styles.iconoVacio}>🛒</p>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde el catálogo para continuar.</p>
        <Link to="/catalogo" className="btn-primario" style={{ marginTop: '16px', display: 'inline-block' }}>
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <h1 className={styles.titulo}>Mi carrito</h1>

      {error && <p className={styles.errorGlobal} role="alert">{error}</p>}

      <div className={styles.layout}>
        <div className={styles.lista}>
          {items.map((item) => {
            const imagenSegura = esUrlSegura(item.productos.imagen_url)
              ? item.productos.imagen_url
              : '/placeholder.png';

            return (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImagen}>
                  <img src={imagenSegura} alt={item.productos.nombre} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className={styles.itemNombre}>{item.productos.nombre}</p>
                  <p className={styles.itemPrecio}>{formatearPrecio(item.productos.precio)} c/u</p>
                </div>
                <div className={styles.itemCantidad}>
                  <button
                    onClick={() => cambiarCantidad(item.id, item.cantidad - 1, item.productos.stock)}
                    disabled={item.cantidad <= 1 || procesando === item.id}
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    onClick={() => cambiarCantidad(item.id, item.cantidad + 1, item.productos.stock)}
                    disabled={item.cantidad >= item.productos.stock || procesando === item.id}
                  >
                    +
                  </button>
                </div>
                <span className={styles.itemSubtotal}>
                  {formatearPrecio(item.productos.precio * item.cantidad)}
                </span>
                <button
                  className={styles.btnEliminar}
                  onClick={() => eliminar(item.id)}
                  disabled={procesando === item.id}
                  aria-label="Eliminar producto"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.resumen}>
          <h2 className={styles.resumenTitulo}>Resumen</h2>
          <div className={styles.resumenLinea}>
            <span>Subtotal</span>
            <span>{formatearPrecio(totalPrecio())}</span>
          </div>
          <div className={styles.resumenLinea}>
            <span>Envío</span>
            <span className={styles.gratis}>Gratis</span>
          </div>
          <div className={styles.resumenTotal}>
            <span>Total</span>
            <span>{formatearPrecio(totalPrecio())}</span>
          </div>
          <button
            className="btn-primario"
            style={{ width: '100%', padding: '12px' }}
            onClick={() => navigate('/checkout')}
          >
            Proceder al pago
          </button>
          <Link to="/catalogo" className={styles.seguirComprando}>
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}