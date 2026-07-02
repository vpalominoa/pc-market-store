import { useEffect, useState } from 'react';
import { obtenerTodosPedidos, actualizarEstadoPedido } from '../../servicios/admin';
import { Pedido, EstadoPedido } from '../../tipos';
import { formatearPrecio, esUrlSegura } from '../../utilidades/seguridad';
import styles from './GestionPedidos.module.css';

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const ESTADOS: EstadoPedido[] = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | ''>('');
  const [actualizando, setActualizando] = useState<string | null>(null);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  const cargarPedidos = () => {
    setCargando(true);
    obtenerTodosPedidos()
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar los pedidos'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleCambiarEstado = async (pedidoId: string, nuevoEstado: EstadoPedido) => {
    setActualizando(pedidoId);
    setError('');
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado);
      setExito('Estado actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
      cargarPedidos();
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar el estado');
    } finally {
      setActualizando(null);
    }
  };

  const pedidosFiltrados = filtroEstado
    ? pedidos.filter((p) => p.estado === filtroEstado)
    : pedidos;

  if (cargando) return <div className={styles.estado}>Cargando pedidos...</div>;

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <div className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Gestión de pedidos</h1>
          <p className={styles.subtitulo}>{pedidos.length} pedidos en total</p>
        </div>
      </div>

      {exito && <p className={styles.exito} role="status">{exito}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.filtros}>
        <button
          className={`${styles.filtroBtn} ${filtroEstado === '' ? styles.filtroActivo : ''}`}
          onClick={() => setFiltroEstado('')}
        >
          Todos ({pedidos.length})
        </button>
        {ESTADOS.map((estado) => (
          <button
            key={estado}
            className={`${styles.filtroBtn} ${filtroEstado === estado ? styles.filtroActivo : ''}`}
            onClick={() => setFiltroEstado(estado)}
          >
            {ETIQUETAS_ESTADO[estado]} ({pedidos.filter((p) => p.estado === estado).length})
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className={styles.vacio}>
          <p>No hay pedidos {filtroEstado ? `con estado "${ETIQUETAS_ESTADO[filtroEstado]}"` : ''}</p>
        </div>
      ) : (
        <div className={styles.lista}>
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className={styles.pedido}>
              <div className={styles.pedidoCabecera}>
                <div className={styles.pedidoInfo}>
                  <button
                    className={styles.btnExpandir}
                    onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
                  >
                    <span className={styles.pedidoId}>
                      #{pedido.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={styles.chevron}>
                      {expandido === pedido.id ? '▲' : '▼'}
                    </span>
                  </button>
                  <div className={styles.pedidoMeta}>
                    <span className={styles.pedidoFecha}>
                      {pedido.tiempo_ventas?.dia_semana} {pedido.tiempo_ventas?.fecha} — {pedido.tiempo_ventas?.hora?.slice(0, 5)}
                    </span>
                    <span className={styles.pedidoTotal}>
                      {formatearPrecio(pedido.total)}
                    </span>
                  </div>
                </div>

                <div className={styles.pedidoAcciones}>
                  <span className={`etiqueta-estado estado-${pedido.estado}`}>
                    {ETIQUETAS_ESTADO[pedido.estado]}
                  </span>
                  <select
                    className={styles.selectEstado}
                    value={pedido.estado}
                    onChange={(e) => handleCambiarEstado(pedido.id, e.target.value as EstadoPedido)}
                    disabled={actualizando === pedido.id}
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {ETIQUETAS_ESTADO[estado]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {expandido === pedido.id && (
                <div className={styles.pedidoDetalle}>
                  <div className={styles.itemsLista}>
                    {pedido.items_pedido?.map((item) => {
                      const imagenSegura = esUrlSegura(item.productos?.imagen_url)
                        ? item.productos.imagen_url
                        : '/placeholder.png';
                      return (
                        <div key={item.id} className={styles.item}>
                          <img
                            src={imagenSegura}
                            alt={item.productos?.nombre || 'Producto'}
                            className={styles.itemImg}
                            referrerPolicy="no-referrer"
                          />
                          <div className={styles.itemInfo}>
                            <p className={styles.itemNombre}>{item.productos?.nombre}</p>
                            <p className={styles.itemMeta}>
                              {item.cantidad} × {formatearPrecio(item.precio_unitario)}
                            </p>
                          </div>
                          <span className={styles.itemSubtotal}>
                            {formatearPrecio(item.precio_unitario * item.cantidad)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.pedidoResumen}>
                    <div className={styles.resumenLinea}>
                      <span>Total del pedido</span>
                      <span className={styles.resumenTotal}>{formatearPrecio(pedido.total)}</span>
                    </div>
                    <div className={styles.resumenLinea}>
                      <span>Fecha de compra</span>
                      <span style={{ textTransform: 'capitalize' }}>
                        {pedido.tiempo_ventas?.dia_semana}, {pedido.tiempo_ventas?.fecha} a las {pedido.tiempo_ventas?.hora?.slice(0, 5)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}