import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProducto } from '../servicios/productos';
import { agregarAlCarrito } from '../servicios/carrito';
import { useAuthStore } from '../store/autenticacion';
import { Producto } from '../tipos';
import { formatearPrecio, esUrlSegura, validarCantidad } from '../utilidades/seguridad';
import styles from './DetalleProducto.module.css';

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const estaAutenticado = useAuthStore((s) => s.estaAutenticado);

  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    obtenerProducto(id)
      .then(setProducto)
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setCargando(false));
  }, [id]);

  const cambiarCantidad = (delta: number) => {
    if (!producto) return;
    const nueva = cantidad + delta;
    if (nueva >= 1 && nueva <= producto.stock) {
      setCantidad(nueva);
    }
  };

  const handleAgregar = async () => {
    if (!producto) return;

    if (!estaAutenticado()) {
      navigate('/login', { state: { desde: `/producto/${producto.id}` } });
      return;
    }

    const errorValidacion = validarCantidad(cantidad, producto.stock);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setAgregando(true);
    setError('');
    try {
      await agregarAlCarrito(producto.id, cantidad, producto.stock);
      setMensajeExito('Producto agregado al carrito');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err: any) {
      setError(err.message || 'No se pudo agregar al carrito');
    } finally {
      setAgregando(false);
    }
  };

  if (cargando) return <div className={styles.estado}>Cargando producto...</div>;
  if (error && !producto) return <div className={styles.estado}>{error}</div>;
  if (!producto) return null;

  const imagenSegura = esUrlSegura(producto.imagen_url) ? producto.imagen_url : '/placeholder.png';
  const especificaciones = Object.entries(producto.especificaciones || {});

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <button onClick={() => navigate(-1)} className={styles.volver}>← Volver</button>

      <div className={styles.grid}>
        <div className={styles.imagen}>
          <img
            src={imagenSegura}
            alt={producto.nombre}
            referrerPolicy="no-referrer"
          />
        </div>

        <div className={styles.info}>
          <p className={styles.categoria}>{producto.categorias?.nombre}</p>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>

          <p className={styles.stockInfo}>
            {producto.stock === 0 ? (
              <span className={styles.sinStock}>Sin stock disponible</span>
            ) : producto.stock <= 5 ? (
              <span className={styles.pocoStock}>Solo quedan {producto.stock} unidades</span>
            ) : (
              <span className={styles.enStock}>Disponible — {producto.stock} unidades en stock</span>
            )}
          </p>

          <p className={styles.descripcion}>{producto.descripcion}</p>

          {producto.stock > 0 && (
            <div className={styles.acciones}>
              <div className={styles.cantidad}>
                <button onClick={() => cambiarCantidad(-1)} disabled={cantidad <= 1} aria-label="Disminuir cantidad">−</button>
                <span>{cantidad}</span>
                <button onClick={() => cambiarCantidad(1)} disabled={cantidad >= producto.stock} aria-label="Aumentar cantidad">+</button>
              </div>
              <button className="btn-primario" onClick={handleAgregar} disabled={agregando}>
                {agregando ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </div>
          )}

          {mensajeExito && <p className={styles.exito} role="status">{mensajeExito}</p>}
          {error && producto && <p className={styles.error} role="alert">{error}</p>}
        </div>
      </div>

      {especificaciones.length > 0 && (
        <div className={styles.especificaciones}>
          <h2 className={styles.tituloSpecs}>Especificaciones técnicas</h2>
          <div className={styles.tablaSpecs}>
            {especificaciones.map(([clave, valor]) => (
              <div key={clave} className={styles.filaSpec}>
                <span className={styles.claveSpec}>{clave.replace(/_/g, ' ')}</span>
                <span className={styles.valorSpec}>{String(valor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}