import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos, obtenerCategorias } from '../servicios/productos';
import { Producto, Categoria } from '../tipos';
import TarjetaProducto from '../componentes/comunes/TarjetaProducto';
import styles from './Inicio.module.css';

export default function Inicio() {
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerProductos({})
      .then((data) => setDestacados(data.slice(0, 8)))
      .catch(() => setError('No se pudieron cargar los productos'));

    obtenerCategorias().then(setCategorias).catch(() => {});
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div className={`contenedor ${styles.heroContenido}`}>
          <h1 className={styles.heroTitulo}>
            Componentes para PC<br />de gama media y alta
          </h1>
          <p className={styles.heroSubtitulo}>
            Procesadores, tarjetas de video, RAM, placas madre y más. Todo en un solo lugar.
          </p>
          <Link to="/catalogo" className="btn-primario" style={{ fontSize: '15px', padding: '12px 28px', width: 'fit-content' }}>
  Ver catálogo
</Link>
        </div>
      </section>

      <section className={styles.seccion}>
        <div className="contenedor">
          <h2 className={styles.tituloSeccion}>Categorías</h2>
          <div className={styles.gridCategorias}>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${encodeURIComponent(cat.id)}`}
                className={styles.tarjetaCategoria}
              >
                <span>{cat.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.seccion}>
        <div className="contenedor">
          <div className={styles.encabezadoSeccion}>
            <h2 className={styles.tituloSeccion}>Productos destacados</h2>
            <Link to="/catalogo" className={styles.verTodos}>Ver todos →</Link>
          </div>

          {error ? (
            <p className={styles.mensajeError}>{error}</p>
          ) : (
            <div className={styles.gridProductos}>
              {destacados.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}