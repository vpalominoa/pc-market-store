import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPedido } from '../servicios/carrito';
import { useCarritoStore } from '../store/carrito';
import { formatearPrecio, esUrlSegura } from '../utilidades/seguridad';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { items, totalPrecio, limpiar } = useCarritoStore();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const confirmarPedido = async () => {
    setProcesando(true);
    setError('');
    try {
      await crearPedido();
      limpiar();
      navigate('/mis-pedidos', { state: { pedidoExitoso: true } });
    } catch (err: any) {
      setError(err.message || 'No se pudo procesar el pedido');
    } finally {
      setProcesando(false);
    }
  };

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <h1 className={styles.titulo}>Confirmar pedido</h1>

      <div className={styles.layout}>
        <div className={styles.productos}>
          <h2 className={styles.subtitulo}>Productos ({items.length})</h2>
          <div className={styles.lista}>
            {items.map((item) => {
              const imagenSegura = esUrlSegura(item.productos.imagen_url)
                ? item.productos.imagen_url
                : '/placeholder.png';
              return (
                <div key={item.id} className={styles.item}>
                  <img
                    src={imagenSegura}
                    alt={item.productos.nombre}
                    className={styles.itemImg}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className={styles.itemNombre}>{item.productos.nombre}</p>
                    <p className={styles.itemCantidad}>Cantidad: {item.cantidad}</p>
                  </div>
                  <span className={styles.itemPrecio}>
                    {formatearPrecio(item.productos.precio * item.cantidad)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.linea}>
            <span>Subtotal</span>
            <span>{formatearPrecio(totalPrecio())}</span>
          </div>
          <div className={styles.linea}>
            <span>Envío</span>
            <span className={styles.gratis}>Gratis</span>
          </div>
          <div className={styles.total}>
            <span>Total a pagar</span>
            <span>{formatearPrecio(totalPrecio())}</span>
          </div>

          <div className={styles.metodoPago}>
            <p className={styles.metodoLabel}>Método de pago</p>
            <div className={styles.metodoOpcion}>
              <input type="radio" id="contraentrega" name="pago" defaultChecked readOnly />
              <label htmlFor="contraentrega">Pago contra entrega</label>
            </div>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button
            className="btn-primario"
            style={{ width: '100%', padding: '12px' }}
            onClick={confirmarPedido}
            disabled={procesando}
          >
            {procesando ? 'Procesando...' : 'Confirmar pedido'}
          </button>
          <button
            className={styles.btnCancelar}
            onClick={() => navigate('/carrito')}
            disabled={procesando}
          >
            Volver al carrito
          </button>
        </div>
      </div>
    </div>
  );
}