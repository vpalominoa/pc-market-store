import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../servicios/autenticacion';
import styles from './FormularioAuth.module.css';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await registrar(nombre, email, password);
      setExito(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch (err: any) {
      setError(err.message || 'No se pudo crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.formulario}>
        <div className={styles.encabezado}>
          <img
            src="/icono-tienda.png"
            alt="PC Market Store"
            className={styles.icono}
            referrerPolicy="no-referrer"
          />
          <h1 className={styles.titulo}>Crear cuenta</h1>
          <p className={styles.subtitulo}>Únete a PC Market Store</p>
        </div>

        {exito ? (
          <div className={styles.exito} role="alert">
            Cuenta creada exitosamente. Revisa tu correo para confirmarla. Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.campos} noValidate>
            {error && <p className={styles.error} role="alert">{error}</p>}

            <div className={styles.campo}>
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre completo"
                maxLength={100}
                autoComplete="name"
                required
                disabled={cargando}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                maxLength={254}
                autoComplete="email"
                required
                disabled={cargando}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                maxLength={72}
                autoComplete="new-password"
                required
                disabled={cargando}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="confirmar">Confirmar contraseña</label>
              <input
                id="confirmar"
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repite tu contraseña"
                maxLength={72}
                autoComplete="new-password"
                required
                disabled={cargando}
              />
            </div>

            <button
              type="submit"
              className="btn-primario"
              disabled={cargando || !nombre || !email || !password || !confirmar}
              style={{ width: '100%', padding: '12px' }}
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className={styles.pie}>
          ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </div>
    </div>
  );
}