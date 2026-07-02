import { Link } from 'react-router-dom';
import styles from './NoEncontrado.module.css';

export default function NoEncontrado() {
  return (
    <div className={styles.pagina}>
      <h1 className={styles.codigo}>404</h1>
      <p className={styles.mensaje}>La página que buscas no existe.</p>
      <Link to="/" className="btn-primario">Volver al inicio</Link>
    </div>
  );
}