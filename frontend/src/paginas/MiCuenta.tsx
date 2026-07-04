import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/autenticacion';
import { obtenerMisPedidos } from '../servicios/carrito';
import {
  Direccion,
  obtenerDirecciones,
  crearDireccion,
  eliminarDireccion,
} from '../servicios/direcciones';
import { Pedido, EstadoPedido } from '../tipos';
import { formatearPrecio, esUrlSegura, sanitizarTexto } from '../utilidades/seguridad';
import styles from './MiCuenta.module.css';

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function MiCuenta() {
  const { usuario } = useAuthStore();
  const ubicacion = useLocation();
  const pedidoExitoso = (ubicacion.state as { pedidoExitoso?: boolean })?.pedidoExitoso;

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(true);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorDireccion, setErrorDireccion] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerMisPedidos()
      .then(setPedidos)
      .catch(() => setPedidos([]))
      .finally(() => setCargandoPedidos(false));

    obtenerDirecciones()
      .then(setDirecciones)
      .catch(() => setDirecciones([]))
      .finally(() => setCargandoDirecciones(false));
  }, []);

  const handleEliminarDireccion = async (id: string) => {
    setEliminandoId(id);
    try {
      await eliminarDireccion(id);
      setDirecciones((actual) => actual.filter((d) => d.id !== id));
    } catch {
      // Si falla la eliminación simplemente se deja la dirección visible
    } finally {
      setEliminandoId(null);
    }
  };

  const validarDireccion = (): boolean => {
    if (direccion.trim().length < 5) {
      setErrorDireccion('Ingresa una dirección válida (mínimo 5 caracteres)');
      return false;
    }
    if (ciudad.trim().length < 2) {
      setErrorDireccion('Ingresa una ciudad válida');
      return false;
    }
    if (!/^[0-9+\s-]{6,15}$/.test(telefono.trim())) {
      setErrorDireccion('Ingresa un teléfono válido');
      return false;
    }
    setErrorDireccion('');
    return true;
  };

  const handleAgregarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarDireccion()) return;

    setGuardando(true);
    try {
      const nueva = await crearDireccion({
        direccion: sanitizarTexto(direccion),
        ciudad: sanitizarTexto(ciudad),
        referencia: referencia ? sanitizarTexto(referencia) : undefined,
        telefono: telefono.trim(),
      });
      setDirecciones((actual) => [nueva, ...actual]);
      setDireccion('');
      setCiudad('');
      setReferencia('');
      setTelefono('');
      setMostrarFormulario(false);
    } catch (err: any) {
      setErrorDireccion(err.message || 'No se pudo guardar la dirección');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <h1 className={styles.titulo}>Mi cuenta</h1>

      {pedidoExitoso && (
        <p className={styles.exito} role="status">
          ¡Tu pedido se realizó con éxito!
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.columnaIzquierda}>
          <section className={styles.tarjeta}>
            <h2 className={styles.subtitulo}>Datos personales</h2>
            <p className={styles.datoLinea}>
              <span className={styles.datoLabel}>Nombre:</span> {usuario?.nombre}
            </p>
            <p className={styles.datoLinea}>
              <span className={styles.datoLabel}>Correo:</span> {usuario?.email}
            </p>
          </section>

          <section className={styles.tarjeta}>
            <div className={styles.cabeceraSeccion}>
              <h2 className={styles.subtitulo}>Direcciones guardadas</h2>
              <button
                type="button"
                className={styles.btnAgregar}
                onClick={() => setMostrarFormulario((v) => !v)}
              >
                {mostrarFormulario ? 'Cancelar' : '+ Agregar'}
              </button>
            </div>

            {mostrarFormulario && (
              <form className={styles.formulario} onSubmit={handleAgregarDireccion}>
                <div className={styles.campo}>
                  <label htmlFor="direccion">Dirección *</label>
                  <input
                    id="direccion"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Av. Ejemplo 123, Dpto. 4B"
                    maxLength={200}
                  />
                </div>
                <div className={styles.campoFila}>
                  <div className={styles.campo}>
                    <label htmlFor="ciudad">Ciudad *</label>
                    <input
                      id="ciudad"
                      type="text"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      placeholder="Lima"
                      maxLength={100}
                    />
                  </div>
                  <div className={styles.campo}>
                    <label htmlFor="telefono">Teléfono *</label>
                    <input
                      id="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="987654321"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className={styles.campo}>
                  <label htmlFor="referencia">Referencia (opcional)</label>
                  <input
                    id="referencia"
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Cerca al parque, edificio azul, etc."
                    maxLength={200}
                  />
                </div>
                {errorDireccion && (
                  <p className={styles.error} role="alert">{errorDireccion}</p>
                )}
                <button className="btn-primario" type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar dirección'}
                </button>
              </form>
            )}

            {cargandoDirecciones ? (
              <p className={styles.estadoVacio}>Cargando direcciones...</p>
            ) : direcciones.length === 0 ? (
              !mostrarFormulario && (
                <p className={styles.estadoVacio}>Aún no tienes direcciones guardadas.</p>
              )
            ) : (
              <div className={styles.listaDirecciones}>
                {direcciones.map((d) => (
                  <div key={d.id} className={styles.direccionItem}>
                    <div>
                      <p className={styles.direccionLinea}>
                        {d.direccion}
                        {d.predeterminada && (
                          <span className={styles.etiquetaPredeterminada}>Predeterminada</span>
                        )}
                      </p>
                      <p className={styles.direccionMeta}>
                        {d.ciudad} · {d.telefono}
                        {d.referencia ? ` · ${d.referencia}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.btnEliminarDireccion}
                      onClick={() => handleEliminarDireccion(d.id)}
                      disabled={eliminandoId === d.id}
                      aria-label="Eliminar dirección"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className={styles.columnaDerecha}>
          <h2 className={styles.subtitulo}>Mis pedidos</h2>

          {cargandoPedidos ? (
            <p className={styles.estadoVacio}>Cargando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <div className={styles.vacio}>
              <p className={styles.iconoVacio}>📦</p>
              <p>Aún no tienes pedidos</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}