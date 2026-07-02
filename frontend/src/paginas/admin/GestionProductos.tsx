import { useEffect, useState } from 'react';
import { obtenerProductosAdmin, crearProducto, editarProducto, desactivarProducto } from '../../servicios/admin';
import { obtenerCategorias } from '../../servicios/productos';
import { Producto, Categoria } from '../../tipos';
import { sanitizarTexto, formatearPrecio, esUrlSegura } from '../../utilidades/seguridad';
import styles from './GestionProductos.module.css';

const PRODUCTO_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  imagen_url: '',
  categoria_id: '',
  especificaciones: '',
};

export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [formulario, setFormulario] = useState(PRODUCTO_VACIO);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [ordenStock, setOrdenStock] = useState<'asc' | 'desc' | null>(null);

  const cargarDatos = () => {
    Promise.all([obtenerProductosAdmin(), obtenerCategorias()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirCrear = () => {
    setProductoEditando(null);
    setFormulario(PRODUCTO_VACIO);
    setError('');
    setMostrarFormulario(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen_url: producto.imagen_url || '',
      categoria_id: producto.categoria_id || '',
      especificaciones: JSON.stringify(producto.especificaciones || {}, null, 2),
    });
    setError('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
    setFormulario(PRODUCTO_VACIO);
    setError('');
  };

  const validarFormulario = (): string | null => {
    if (!formulario.nombre.trim() || formulario.nombre.trim().length < 3)
      return 'El nombre debe tener al menos 3 caracteres';
    if (formulario.nombre.trim().length > 200)
      return 'El nombre no puede superar los 200 caracteres';
    if (!formulario.precio || isNaN(Number(formulario.precio)) || Number(formulario.precio) <= 0)
      return 'El precio debe ser un número mayor a 0';
    if (Number(formulario.precio) >= 100000)
      return 'El precio no puede superar S/ 100,000';
    if (!formulario.stock || isNaN(Number(formulario.stock)) || Number(formulario.stock) < 0)
      return 'El stock debe ser un número mayor o igual a 0';
    if (Number(formulario.stock) > 9999)
      return 'El stock no puede superar 9,999 unidades';
    if (formulario.imagen_url && !esUrlSegura(formulario.imagen_url))
      return 'La URL de imagen debe comenzar con http:// o https://';
    if (!formulario.categoria_id)
      return 'Selecciona una categoría';
    if (formulario.especificaciones.trim()) {
      try {
        JSON.parse(formulario.especificaciones);
      } catch {
        return 'Las especificaciones deben ser JSON válido';
      }
    }
    return null;
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        nombre: sanitizarTexto(formulario.nombre.trim()),
        descripcion: sanitizarTexto(formulario.descripcion.trim()).slice(0, 2000),
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        imagen_url: formulario.imagen_url.trim(),
        categoria_id: formulario.categoria_id,
        especificaciones: formulario.especificaciones.trim()
          ? JSON.parse(formulario.especificaciones)
          : {},
      };

      if (productoEditando) {
        await editarProducto(productoEditando.id, datos);
        setExito('Producto actualizado correctamente');
      } else {
        await crearProducto(datos);
        setExito('Producto creado correctamente');
      }

      setTimeout(() => setExito(''), 3000);
      cerrarFormulario();
      cargarDatos();
    } catch (err: any) {
      setError(err.message || 'No se pudo guardar el producto');
    } finally {
      setGuardando(false);
    }
  };

  const handleDesactivar = async (id: string, nombre: string) => {
    if (!confirm(`¿Desactivar el producto "${nombre}"?`)) return;
    try {
      await desactivarProducto(id);
      setExito('Producto desactivado');
      setTimeout(() => setExito(''), 3000);
      cargarDatos();
    } catch {
      setError('No se pudo desactivar el producto');
    }
  };

const productosFiltrados = productos
  .filter((p) => p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  .sort((a, b) => {
    if (ordenStock === 'asc') return a.stock - b.stock;
    if (ordenStock === 'desc') return b.stock - a.stock;
    return 0;
  });

  if (cargando) return <div className={styles.estado}>Cargando productos...</div>;

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <div className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Gestión de productos</h1>
          <p className={styles.subtitulo}>{productos.length} productos en total</p>
        </div>
        <button className="btn-primario" onClick={abrirCrear}>
          + Nuevo producto
        </button>
      </div>

      {exito && <p className={styles.exito} role="status">{exito}</p>}
      {error && !mostrarFormulario && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.barraBusqueda}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
          maxLength={100}
          className={styles.inputBusqueda}
        />
      </div>

      <div className={styles.tablaContenedor}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>
                <button
                  className={`${styles.btnOrden} ${ordenStock ? styles.btnOrdenActivo : ''}`}
                  onClick={() => {
                    if (ordenStock === null) setOrdenStock('asc');
                    else if (ordenStock === 'asc') setOrdenStock('desc');
                    else setOrdenStock(null);
                  }}
                >
                  Stock
                  <span>{ordenStock === 'asc' ? '↑' : ordenStock === 'desc' ? '↓' : '↕'}</span>
                </button>
              </th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id} className={!producto.activo ? styles.filaInactiva : ''}>
                <td>
                  <p className={styles.nombreProducto}>{producto.nombre}</p>
                </td>
                <td>{producto.categorias?.nombre || '—'}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>
                  <span className={
                    producto.stock === 0 ? styles.sinStock :
                    producto.stock <= 5 ? styles.pocoStock :
                    styles.enStock
                  }>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <span className={producto.activo ? styles.activo : styles.inactivo}>
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className={styles.acciones}>
                    <button
                      className={styles.btnEditar}
                      onClick={() => abrirEditar(producto)}
                    >
                      Editar
                    </button>
                    {producto.activo && (
                      <button
                        className={styles.btnDesactivar}
                        onClick={() => handleDesactivar(producto.id, producto.nombre)}
                      >
                        Desactivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productosFiltrados.length === 0 && (
          <p className={styles.vacio}>No se encontraron productos</p>
        )}
      </div>

      {mostrarFormulario && (
        <div className={styles.modalOverlay} onClick={cerrarFormulario}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalEncabezado}>
              <h2 className={styles.modalTitulo}>
                {productoEditando ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button className={styles.btnCerrar} onClick={cerrarFormulario}>✕</button>
            </div>

            <form onSubmit={handleGuardar} className={styles.formulario} noValidate>
              {error && <p className={styles.error} role="alert">{error}</p>}

              <div className={styles.grilla}>
                <div className={styles.campo}>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    value={formulario.nombre}
                    onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                    maxLength={200}
                    required
                    disabled={guardando}
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    value={formulario.categoria_id}
                    onChange={(e) => setFormulario({ ...formulario, categoria_id: e.target.value })}
                    required
                    disabled={guardando}
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="precio">Precio (S/)</label>
                  <input
                    id="precio"
                    type="number"
                    value={formulario.precio}
                    onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
                    min="0.01"
                    max="99999.99"
                    step="0.01"
                    required
                    disabled={guardando}
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    value={formulario.stock}
                    onChange={(e) => setFormulario({ ...formulario, stock: e.target.value })}
                    min="0"
                    max="9999"
                    required
                    disabled={guardando}
                  />
                </div>

                <div className={`${styles.campo} ${styles.campoCompleto}`}>
                  <label htmlFor="imagen_url">URL de imagen</label>
                  <input
                    id="imagen_url"
                    type="url"
                    value={formulario.imagen_url}
                    onChange={(e) => setFormulario({ ...formulario, imagen_url: e.target.value })}
                    placeholder="https://..."
                    maxLength={500}
                    disabled={guardando}
                  />
                </div>

                <div className={`${styles.campo} ${styles.campoCompleto}`}>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    value={formulario.descripcion}
                    onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                    maxLength={2000}
                    rows={3}
                    disabled={guardando}
                  />
                </div>

                <div className={`${styles.campo} ${styles.campoCompleto}`}>
                  <label htmlFor="especificaciones">
                    Especificaciones técnicas <span className={styles.hint}>(formato JSON)</span>
                  </label>
                  <textarea
                    id="especificaciones"
                    value={formulario.especificaciones}
                    onChange={(e) => setFormulario({ ...formulario, especificaciones: e.target.value })}
                    rows={5}
                    placeholder='{"nucleos": "8", "frecuencia": "5.0 GHz"}'
                    className={styles.textareaCode}
                    disabled={guardando}
                  />
                </div>
              </div>

              <div className={styles.modalAcciones}>
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primario"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : productoEditando ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}