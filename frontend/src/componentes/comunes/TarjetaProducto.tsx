import { Link } from 'react-router-dom';
import { Producto } from '../../tipos';
import { formatearPrecio, esUrlSegura } from '../../utilidades/seguridad';
import styles from './TarjetaProducto.module.css';

interface Props {
  producto: Producto;
}

export default function TarjetaProducto({ producto }: Props) {
  const imagenSegura = esUrlSegura(producto.imagen_url) ? producto.imagen_url : '/placeholder.png';

  return (
    <Link to={`/producto/${producto.id}`} className={styles.tarjeta}>
      <div className={styles.imagen}>
        <img
          src={imagenSegura}
          alt={producto.nombre}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      <div className={styles.cuerpo}>
        <p className={styles.categoria}>{producto.categorias?.nombre}</p>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <div className={styles.inferior}>
          <span className={styles.precio}>{formatearPrecio(producto.precio)}</span>
          {producto.stock === 0 ? (
            <span className={styles.sinStock}>Sin stock</span>
          ) : producto.stock <= 5 ? (
            <span className={styles.pocoStock}>Últimas {producto.stock} unidades</span>
          ) : (
            <span className={styles.enStock}>En stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}