import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerProductos, obtenerCategorias } from '../servicios/productos';
import { Producto, Categoria, FiltrosProducto } from '../tipos';
import { sanitizarTexto } from '../utilidades/seguridad';
import TarjetaProducto from '../componentes/comunes/TarjetaProducto';
import styles from './Catalogo.module.css';

const ORDENES_VALIDOS = ['precio_asc', 'precio_desc'] as const;

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const categoriaActual = searchParams.get('categoria') || '';
  const ordenParam = searchParams.get('orden') || '';
  const ordenActual = ORDENES_VALIDOS.includes(ordenParam as any) ? ordenParam : '';

  useEffect(() => {
    obtenerCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    const filtros: FiltrosProducto = {};
    if (categoriaActual) filtros.categoriaId = categoriaActual;
    if (ordenActual) filtros.orden = ordenActual as FiltrosProducto['orden'];
    if (busqueda.trim()) filtros.busqueda = sanitizarTexto(busqueda.trim()).slice(0, 100);

    const temporizador = setTimeout(() => {
      obtenerProductos(filtros)
        .then(setProductos)
        .catch(() => setProductos([]))
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(temporizador);
  }, [categoriaActual, ordenActual, busqueda]);

  const actualizarFiltro = (clave: string, valor: string) => {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    setSearchParams(params);
  };

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <aside className={styles.filtros}>
        <h2 className={styles.tituloFiltros}>Filtros</h2>

        <div className={styles.grupo}>
          <label className={styles.etiqueta} htmlFor="busqueda">Buscar</label>
          <input
            id="busqueda"
            type="text"
            placeholder="Nombre del producto..."
            className={styles.input}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className={styles.grupo}>
          <span className={styles.etiqueta}>Categoría</span>
          <ul className={styles.listaFiltros}>
            <li
              className={`${styles.itemFiltro} ${!categoriaActual ? styles.activo : ''}`}
              onClick={() => actualizarFiltro('categoria', '')}
            >
              Todas
            </li>
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className={`${styles.itemFiltro} ${categoriaActual === cat.id ? styles.activo : ''}`}
                onClick={() => actualizarFiltro('categoria', cat.id)}
              >
                {cat.nombre}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.grupo}>
          <label className={styles.etiqueta} htmlFor="orden">Ordenar por</label>
          <select
            id="orden"
            className={styles.select}
            value={ordenActual}
            onChange={(e) => actualizarFiltro('orden', e.target.value)}
          >
            <option value="">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
          </select>
        </div>
      </aside>

      <div className={styles.resultados}>
        <p className={styles.cantidad}>{productos.length} productos encontrados</p>
        {cargando ? (
          <p className={styles.vacio}>Cargando...</p>
        ) : productos.length === 0 ? (
          <p className={styles.vacio}>No se encontraron productos.</p>
        ) : (
          <div className={styles.grid}>
            {productos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}