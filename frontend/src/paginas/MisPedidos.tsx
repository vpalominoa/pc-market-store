import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { obtenerMisPedidos } from '../servicios/carrito';
import { Pedido, EstadoPedido } from '../tipos';
import { formatearPrecio, esUrlSegura } from '../utilidades/seguridad';
import styles from './MisPedidos.module.css';

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const ubicacion = useLocation();
  const pedidoExitoso = (ubicacion.state as { pedidoExitoso?: boolean })?.pedidoExitoso;

  useEffect(() => {
    obtenerMisPedidos()
      .then(setPedidos)
      .catch(() => setPedidos([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <div className={styles.estado}>Cargando pedidos...</div>;

  if (pedidos.length === 0) {
    return (
      <div className={`contenedor ${styles.vacio}`}>
        <p className={styles.iconoVacio}>📦</p>
        <h2>Aún no tienes pedidos</h2>
        <p>Cuando realices una compra, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <h1 className={styles.titulo}>Mis pedidos</h1>

      {pedidoExitoso && (
        <p className={styles.exito} role="status">
          ¡Tu pedido se realizó con éxito!
        </p>
      )}

      <div className={styles.lista}>
        {pedidos.map((pedido) => (
          <div key={pedido.id} className={styles.pedido}>
            <button
              className={styles.pedidoCabecera}
              onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
            >
              <div>
                <p className={styles.pedidoId}>Pedido #{pedido.id.slice(0, 8).toUpperCase()}</p>
                <p className={styles.pedidoFecha}>
                  {pedido.tiempo_ventas?.fecha} — {pedido.tiempo_ventas?.hora?.slice(0, 5)}
                </p>
              </div>
              <div className={styles.pedidoDerecha}>
                <span className={`etiqueta-estado estado-${pedido.estado}`}>
                  {ETIQUETAS_ESTADO[pedido.estado]}
                </span>
                <span className={styles.pedidoTotal}>{formatearPrecio(pedido.total)}</span>
                <span className={styles.chevron}>{expandido === pedido.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {expandido === pedido.id && (
              <div className={styles.pedidoDetalle}>
                {pedido.items_pedido?.map((item) => {
                  const imagenSegura = esUrlSegura(item.productos?.imagen_url)
                    ? item.productos.imagen_url
                    : '/placeholder.png';
                  return (
                    <div key={item.id} className={styles.itemDetalle}>
                      <img
                        src={imagenSegura}
                        alt={item.productos?.nombre || 'Producto'}
                        className={styles.itemImg}
                        referrerPolicy="no-referrer"
                      />
                      <div>
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
                <p className={styles.fechaVenta}>
                  Realizado el {pedido.tiempo_ventas?.dia_semana}, {pedido.tiempo_ventas?.fecha}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}