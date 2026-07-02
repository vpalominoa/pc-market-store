import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerTodosPedidos, obtenerProductosAdmin } from '../../servicios/admin';
import { Pedido, Producto, EstadoPedido } from '../../tipos';
import { formatearPrecio } from '../../utilidades/seguridad';
import styles from './PanelAdmin.module.css';

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function PanelAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([obtenerTodosPedidos(), obtenerProductosAdmin()])
      .then(([p, pr]) => {
        setPedidos(p);
        setProductos(pr);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const totalVentas = pedidos
    .filter((p) => p.estado !== 'cancelado')
    .reduce((acc, p) => acc + p.total, 0);

  const pedidosHoy = pedidos.filter(
    (p) => p.tiempo_ventas?.fecha === new Date().toISOString().split('T')[0]
  ).length;

  const productosBajoStock = productos.filter((p) => p.stock <= 5 && p.activo);
  const ultimosPedidos = [...pedidos].slice(0, 5);

  if (cargando) return <div className={styles.estado}>Cargando panel...</div>;

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <div className={styles.encabezado}>
        <h1 className={styles.titulo}>Panel de administración</h1>
        <p className={styles.subtitulo}>Resumen general de PC Market Store</p>
      </div>

      <div className={styles.estadisticas}>
        <div className={styles.tarjetaStat}>
          <p className={styles.statLabel}>Total pedidos</p>
          <p className={styles.statValor}>{pedidos.length}</p>
        </div>
        <div className={styles.tarjetaStat}>
          <p className={styles.statLabel}>Ventas totales</p>
          <p className={styles.statValor}>{formatearPrecio(totalVentas)}</p>
        </div>
        <div className={styles.tarjetaStat}>
          <p className={styles.statLabel}>Pedidos hoy</p>
          <p className={styles.statValor}>{pedidosHoy}</p>
        </div>
        <div className={styles.tarjetaStat}>
          <p className={styles.statLabel}>Productos activos</p>
          <p className={styles.statValor}>{productos.filter((p) => p.activo).length}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelEncabezado}>
            <h2 className={styles.panelTitulo}>Últimos pedidos</h2>
            <Link to="/admin/pedidos" className={styles.verTodos}>Ver todos →</Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <p className={styles.vacio}>No hay pedidos aún</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className={styles.idCelda}>
                      #{pedido.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td>{pedido.tiempo_ventas?.fecha || '—'}</td>
                    <td>{formatearPrecio(pedido.total)}</td>
                    <td>
                      <span className={`etiqueta-estado estado-${pedido.estado}`}>
                        {ETIQUETAS_ESTADO[pedido.estado]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelEncabezado}>
            <h2 className={styles.panelTitulo}>Bajo stock</h2>
            <Link to="/admin/productos" className={styles.verTodos}>Ver todos →</Link>
          </div>
          {productosBajoStock.length === 0 ? (
            <p className={styles.vacio}>Todos los productos tienen stock suficiente</p>
          ) : (
            <div className={styles.listaStock}>
              {productosBajoStock.map((p) => (
                <div key={p.id} className={styles.itemStock}>
                  <span className={styles.itemNombre}>{p.nombre}</span>
                  <span className={`${styles.itemUnidades} ${p.stock === 0 ? styles.sinStock : styles.pocoStock}`}>
                    {p.stock === 0 ? 'Sin stock' : `${p.stock} unidades`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.accesosRapidos}>
        <Link to="/admin/productos" className={styles.accesoBtn}>
          <span className={styles.accesoIcono}>📦</span>
          <span>Gestionar productos</span>
        </Link>
        <Link to="/admin/pedidos" className={styles.accesoBtn}>
          <span className={styles.accesoIcono}>🧾</span>
          <span>Gestionar pedidos</span>
        </Link>
      </div>
    </div>
  );
}