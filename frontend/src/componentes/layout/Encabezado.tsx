import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuthStore } from '../../store/autenticacion';
import { useCarritoStore } from '../../store/carrito';
import { obtenerProductos, obtenerCategorias } from '../../servicios/productos';
import { obtenerCarrito } from '../../servicios/carrito';
import { sanitizarTexto } from '../../utilidades/seguridad';
import { Producto, Categoria } from '../../tipos';
import styles from './Encabezado.module.css';

export default function Encabezado() {
  const { usuario, estaAutenticado, cerrarSesion } = useAuthStore();
  const { totalItems, establecerItems } = useCarritoStore();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [mostrarDropdownCat, setMostrarDropdownCat] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const busquedaRef = useRef<HTMLDivElement>(null);

  const primerNombre = usuario?.nombre
    ? sanitizarTexto(usuario.nombre.split(' ')[0])
    : '';

  useEffect(() => {
    obtenerCategorias().then(setCategorias).catch(() => {});
    obtenerProductos({}).then(setProductos).catch(() => {});
  }, []);

  useEffect(() => {
    if (estaAutenticado()) {
      obtenerCarrito().then(establecerItems).catch(() => {});
    }
  }, [usuario]);

  useEffect(() => {
    if (busqueda.trim().length < 2) {
      setSugerencias([]);
      return;
    }

    const fuse = new Fuse(productos, {
      keys: ['nombre', 'descripcion', 'categorias.nombre'],
      threshold: 0.4,
      minMatchCharLength: 2,
    });

    const resultados = fuse.search(sanitizarTexto(busqueda.trim())).slice(0, 6);
    setSugerencias(resultados.map((r) => r.item));
    setMostrarSugerencias(true);
  }, [busqueda, productos]);

  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (busquedaRef.current && !busquedaRef.current.contains(e.target as Node)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busqueda.trim()) return;
    setMostrarSugerencias(false);
    navigate(`/catalogo?busqueda=${encodeURIComponent(busqueda.trim())}`);
    setBusqueda('');
  };

  const handleSeleccionarSugerencia = (producto: Producto) => {
    setMostrarSugerencias(false);
    setBusqueda('');
    navigate(`/producto/${producto.id}`);
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

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

        <div
          className={styles.categorias}
          onMouseEnter={() => setMostrarDropdownCat(true)}
          onMouseLeave={() => setMostrarDropdownCat(false)}
        >
          <button className={styles.btnCategorias}>
            Categorías <span className={styles.flecha}>▾</span>
          </button>
          {mostrarDropdownCat && (
            <div className={styles.dropdown}>
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogo?categoria=${encodeURIComponent(cat.id)}`}
                  className={styles.dropdownItem}
                  onClick={() => setMostrarDropdownCat(false)}
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.buscadorWrap} ref={busquedaRef}>
          <form onSubmit={handleBuscar} className={styles.buscador}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              maxLength={100}
              className={styles.inputBusqueda}
              onFocus={() => sugerencias.length > 0 && setMostrarSugerencias(true)}
            />
            <button type="submit" className={styles.btnBuscar} aria-label="Buscar">
              🔍
            </button>
          </form>

          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className={styles.sugerencias}>
              {sugerencias.map((p) => (
                <button
                  key={p.id}
                  className={styles.sugerenciaItem}
                  onClick={() => handleSeleccionarSugerencia(p)}
                >
                  <span className={styles.sugerenciaNombre}>{p.nombre}</span>
                  <span className={styles.sugerenciaCategoria}>
                    {p.categorias?.nombre}
                  </span>
                </button>
              ))}
              <button
                className={styles.sugerenciaVerTodos}
                onClick={handleBuscar as any}
              >
                Ver todos los resultados para "{busqueda}"
              </button>
            </div>
          )}
        </div>

        <div className={styles.acciones}>
          {estaAutenticado() ? (
            <div className={styles.usuarioMenu}>
              <Link to="/mi-cuenta" className={styles.bienvenida}>
                Hola, {primerNombre}
              </Link>

              <Link to="/carrito" className={styles.botonCarrito} aria-label="Ver carrito">
                🛒
                {totalItems() > 0 && (
                  <span className={styles.badge}>
                    {totalItems() > 99 ? '99+' : totalItems()}
                  </span>
                )}
              </Link>

              {usuario?.rol === 'admin' && (
                <Link to="/admin" className={styles.menuEnlace}>Panel admin</Link>
              )}

              <button className={styles.btnSalir} onClick={handleCerrarSesion}>
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link to="/carrito" className={styles.botonCarrito} aria-label="Ver carrito">
                🛒
                {totalItems() > 0 && (
                  <span className={styles.badge}>
                    {totalItems() > 99 ? '99+' : totalItems()}
                  </span>
                )}
              </Link>
              <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}