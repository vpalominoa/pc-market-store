import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../servicios/autenticacion';
import { useAuthStore } from '../store/autenticacion';
import styles from './FormularioAuth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const establecerSesion = useAuthStore((s) => s.establecerSesion);
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const { token, usuario } = await login(email, password);
      establecerSesion(usuario, token);
      const destino = (ubicacion.state as { desde?: string })?.desde || '/';
      navigate(destino, { replace: true });
    } catch (err) {
      setError('Correo o contraseña incorrectos');
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
          <h1 className={styles.titulo}>Ingresar</h1>
          <p className={styles.subtitulo}>Accede a tu cuenta de PC Market Store</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.campos} noValidate>
          {error && <p className={styles.error} role="alert">{error}</p>}

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
              placeholder="••••••••"
              maxLength={72}
              autoComplete="current-password"
              required
              disabled={cargando}
            />
          </div>

          <button
            type="submit"
            className="btn-primario"
            disabled={cargando || !email || !password}
            style={{ width: '100%', padding: '12px' }}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.pie}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}