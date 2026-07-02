import { Link } from 'react-router-dom';
import styles from './PiePagina.module.css';

export default function PiePagina() {
  return (
    <footer className={styles.pie}>
      <div className={`contenedor ${styles.contenido}`}>
        <div className={styles.marca}>
          <img
            src="/icono-tienda.png"
            alt="PC Market Store"
            className={styles.icono}
            referrerPolicy="no-referrer"
          />
          <span>PC Market Store</span>
        </div>
        <p className={styles.descripcion}>
          Componentes para PC de gama media y alta. Calidad garantizada.
        </p>
        <nav className={styles.enlaces}>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/mis-pedidos">Mis pedidos</Link>
        </nav>
        <p className={styles.copyright}>© 2025 PC Market Store. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}