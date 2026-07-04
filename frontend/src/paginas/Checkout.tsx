import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPedido } from '../servicios/carrito';
import { useCarritoStore } from '../store/carrito';
import { useAuthStore } from '../store/autenticacion';
import { formatearPrecio, esUrlSegura, sanitizarTexto } from '../utilidades/seguridad';
import { DatosEnvio } from '../tipos';
import { Direccion, obtenerDirecciones, crearDireccion } from '../servicios/direcciones';
import styles from './Checkout.module.css';

type Paso = 1 | 2 | 3 | 4;

export default function Checkout() {
  const { items, totalPrecio, limpiar } = useCarritoStore();
  const { usuario } = useAuthStore();
  const navigate = useNavigate();

  const [pasoActivo, setPasoActivo] = useState<Paso>(1);
  const [pasoMaximo, setPasoMaximo] = useState<Paso>(1);

  const [direccionesGuardadas, setDireccionesGuardadas] = useState<Direccion[]>([]);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(true);
  const [direccionSeleccionadaId, setDireccionSeleccionadaId] = useState<string | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);

  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardarDireccion, setGuardarDireccion] = useState(true);
  const [errorDireccion, setErrorDireccion] = useState('');

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDirecciones = async () => {
      try {
        const lista = await obtenerDirecciones();
        setDireccionesGuardadas(lista);
        const predeterminada = lista.find((d) => d.predeterminada) || lista[0];
        if (predeterminada) {
          setDireccionSeleccionadaId(predeterminada.id);
        } else {
          setMostrarFormularioNuevo(true);
        }
      } catch {
        setMostrarFormularioNuevo(true);
      } finally {
        setCargandoDirecciones(false);
      }
    };
    cargarDirecciones();
  }, []);

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  const irAPaso = (paso: Paso) => {
    if (paso <= pasoMaximo) setPasoActivo(paso);
  };

  const avanzarDesdePaso1 = () => {
    setPasoActivo(2);
    setPasoMaximo((actual) => (actual < 2 ? 2 : actual));
  };

  const obtenerDatosEnvioSeleccionados = (): DatosEnvio | null => {
    if (!mostrarFormularioNuevo && direccionSeleccionadaId) {
      const seleccionada = direccionesGuardadas.find((d) => d.id === direccionSeleccionadaId);
      if (!seleccionada) return null;
      return {
        direccion: seleccionada.direccion,
        ciudad: seleccionada.ciudad,
        referencia: seleccionada.referencia,
        telefono: seleccionada.telefono,
      };
    }
    return {
      direccion: sanitizarTexto(direccion),
      ciudad: sanitizarTexto(ciudad),
      referencia: referencia ? sanitizarTexto(referencia) : undefined,
      telefono: telefono.trim(),
    };
  };

  const validarDireccion = (): boolean => {
    if (!mostrarFormularioNuevo) {
      if (!direccionSeleccionadaId) {
        setErrorDireccion('Selecciona una dirección o agrega una nueva');
        return false;
      }
      setErrorDireccion('');
      return true;
    }
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

  const avanzarDesdePaso2 = async () => {
    if (!validarDireccion()) return;

    if (mostrarFormularioNuevo && guardarDireccion) {
      try {
        const nueva = await crearDireccion({
          direccion: sanitizarTexto(direccion),
          ciudad: sanitizarTexto(ciudad),
          referencia: referencia ? sanitizarTexto(referencia) : undefined,
          telefono: telefono.trim(),
        });
        setDireccionesGuardadas((actual) => [nueva, ...actual]);
        setDireccionSeleccionadaId(nueva.id);
        setMostrarFormularioNuevo(false);
      } catch {
        // Si falla el guardado, se continúa con los datos ingresados sin bloquear el pedido
      }
    }

    setPasoActivo(3);
    setPasoMaximo((actual) => (actual < 3 ? 3 : actual));
  };

  const avanzarDesdePaso3 = () => {
    setPasoActivo(4);
    setPasoMaximo((actual) => (actual < 4 ? 4 : actual));
  };

  const confirmarPedido = async () => {
    if (!validarDireccion()) {
      setPasoActivo(2);
      return;
    }

    const datosEnvio = obtenerDatosEnvioSeleccionados();
    if (!datosEnvio) {
      setError('Selecciona o completa una dirección de envío');
      setPasoActivo(2);
      return;
    }

    setProcesando(true);
    setError('');
    try {
      await crearPedido(datosEnvio);
      limpiar();
      navigate('/mis-pedidos', { state: { pedidoExitoso: true } });
    } catch (err: any) {
      setError(err.message || 'No se pudo procesar el pedido');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className={`contenedor ${styles.pagina}`}>
      <h1 className={styles.titulo}>Confirmar pedido</h1>

      <div className={styles.layout}>
        <div className={styles.pasos}>
          {/* PASO 1: DATOS PERSONALES */}
          <div className={styles.paso}>
            <button
              className={styles.pasoCabecera}
              onClick={() => irAPaso(1)}
              disabled={pasoMaximo < 1}
            >
              <span className={`${styles.pasoNumero} ${pasoActivo === 1 ? styles.pasoNumeroActivo : ''}`}>1</span>
              <span className={styles.pasoTitulo}>Datos personales</span>
            </button>
            {pasoActivo === 1 && (
              <div className={styles.pasoContenido}>
                <p className={styles.datoLinea}>
                  <span className={styles.datoLabel}>Nombre:</span> {usuario?.nombre}
                </p>
                <p className={styles.datoLinea}>
                  <span className={styles.datoLabel}>Correo:</span> {usuario?.email}
                </p>
                <button className="btn-primario" onClick={avanzarDesdePaso1}>
                  Continuar
                </button>
              </div>
            )}
          </div>

          {/* PASO 2: DIRECCIONES */}
          <div className={styles.paso}>
            <button
              className={styles.pasoCabecera}
              onClick={() => irAPaso(2)}
              disabled={pasoMaximo < 2}
            >
              <span className={`${styles.pasoNumero} ${pasoActivo === 2 ? styles.pasoNumeroActivo : ''}`}>2</span>
              <span className={styles.pasoTitulo}>Direcciones</span>
            </button>
            {pasoActivo === 2 && (
              <div className={styles.pasoContenido}>
                {cargandoDirecciones && <p className={styles.datoLinea}>Cargando direcciones...</p>}

                {!cargandoDirecciones && direccionesGuardadas.length > 0 && (
                  <div className={styles.listaDirecciones}>
                    {direccionesGuardadas.map((d) => (
                      <div key={d.id} className={styles.metodoOpcionCaja}>
                        <input
                          type="radio"
                          id={`direccion-${d.id}`}
                          name="direccion-guardada"
                          checked={!mostrarFormularioNuevo && direccionSeleccionadaId === d.id}
                          onChange={() => {
                            setDireccionSeleccionadaId(d.id);
                            setMostrarFormularioNuevo(false);
                          }}
                        />
                        <label htmlFor={`direccion-${d.id}`}>
                          <span className={styles.metodoNombre}>
                            {d.direccion} {d.predeterminada && '· Predeterminada'}
                          </span>
                          <span className={styles.metodoDetalle}>
                            {d.ciudad} · {d.telefono}
                            {d.referencia ? ` · ${d.referencia}` : ''}
                          </span>
                        </label>
                      </div>
                    ))}

                    {!mostrarFormularioNuevo && (
                      <button
                        type="button"
                        className={styles.btnAgregarDireccion}
                        onClick={() => setMostrarFormularioNuevo(true)}
                      >
                        + Agregar nueva dirección
                      </button>
                    )}
                  </div>
                )}

                {!cargandoDirecciones && mostrarFormularioNuevo && (
                  <>
                    {direccionesGuardadas.length > 0 && (
                      <button
                        type="button"
                        className={styles.btnAgregarDireccion}
                        onClick={() => setMostrarFormularioNuevo(false)}
                      >
                        ← Usar una dirección guardada
                      </button>
                    )}
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
                    <label className={styles.checkboxLinea}>
                      <input
                        type="checkbox"
                        checked={guardarDireccion}
                        onChange={(e) => setGuardarDireccion(e.target.checked)}
                      />
                      Guardar esta dirección para futuros pedidos
                    </label>
                  </>
                )}

                {errorDireccion && <p className={styles.error} role="alert">{errorDireccion}</p>}
                <button className="btn-primario" onClick={avanzarDesdePaso2} disabled={cargandoDirecciones}>
                  Continuar
                </button>
              </div>
            )}
          </div>

          {/* PASO 3: METODO DE ENVIO */}
          <div className={styles.paso}>
            <button
              className={styles.pasoCabecera}
              onClick={() => irAPaso(3)}
              disabled={pasoMaximo < 3}
            >
              <span className={`${styles.pasoNumero} ${pasoActivo === 3 ? styles.pasoNumeroActivo : ''}`}>3</span>
              <span className={styles.pasoTitulo}>Método de envío</span>
            </button>
            {pasoActivo === 3 && (
              <div className={styles.pasoContenido}>
                <div className={styles.metodoOpcionCaja}>
                  <input type="radio" id="envio-gratis" name="envio" defaultChecked readOnly />
                  <label htmlFor="envio-gratis">
                    <span className={styles.metodoNombre}>Envío estándar</span>
                    <span className={styles.metodoDetalle}>Gratis · 3 a 5 días hábiles</span>
                  </label>
                </div>
                <button className="btn-primario" onClick={avanzarDesdePaso3}>
                  Continuar
                </button>
              </div>
            )}
          </div>

          {/* PASO 4: PAGO */}
          <div className={styles.paso}>
            <button
              className={styles.pasoCabecera}
              onClick={() => irAPaso(4)}
              disabled={pasoMaximo < 4}
            >
              <span className={`${styles.pasoNumero} ${pasoActivo === 4 ? styles.pasoNumeroActivo : ''}`}>4</span>
              <span className={styles.pasoTitulo}>Pago</span>
            </button>
            {pasoActivo === 4 && (
              <div className={styles.pasoContenido}>
                <div className={styles.metodoOpcionCaja}>
                  <input type="radio" id="contraentrega" name="pago" defaultChecked readOnly />
                  <label htmlFor="contraentrega">
                    <span className={styles.metodoNombre}>Pago contra entrega</span>
                  </label>
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
              </div>
            )}
          </div>
        </div>

        <div className={styles.panel}>
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