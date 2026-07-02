import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/autenticacion';
import { useCarritoStore } from '../../store/carrito';
import { sanitizarTexto } from '../../utilidades/seguridad';
import styles from './Encabezado.module.css';

export default function Encabezado() {
  const { usuario, estaAutenticado, esAdmin, cerrarSesion } = useAuthStore();
  const totalItems = useCarritoStore((s) => s.totalItems);
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  const primerNombre = usuario?.nombre ? sanitizarTexto(usuario.nombre.split(' ')[0]) : '';

  return (
    <header className={styles.encabezado}>
      <div className={`contenedor ${styles.contenido}`}>
        <Link to="/" className={styles.marca}>
          <img
            src="/icono-tienda.png"
            alt="PC Market Store"
            className={styles.icono}
            referrerPolicy="no-referrer"
          />
          <span>PC Market Store</span>
        </Link>

<nav className={styles.nav}>
  <Link to="/" className={styles.enlace}>Inicio</Link>
  <Link to="/catalogo" className={styles.enlace}>Catálogo</Link>
  {estaAutenticado() && (
    <Link to="/mis-pedidos" className={styles.enlace}>Mis pedidos</Link>
  )}
  {esAdmin() && (
    <Link to="/admin" className={styles.enlace}>Panel admin</Link>
  )}
</nav>

        <div className={styles.acciones}>
          {estaAutenticado() ? (
            <>
              <span className={styles.bienvenida}>Hola, {primerNombre}</span>
              <Link to="/carrito" className={styles.botonCarrito} aria-label="Ver carrito">
                🛒
                {totalItems() > 0 && (
                  <span className={styles.badge}>{totalItems() > 99 ? '99+' : totalItems()}</span>
                )}
              </Link>
              <button className={styles.botonSalir} onClick={handleCerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.enlaceAuth}>Ingresar</Link>
              <Link to="/registro" className="btn-primario">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}