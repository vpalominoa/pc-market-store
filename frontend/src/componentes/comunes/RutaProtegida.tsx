import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/autenticacion';

export default function RutaProtegida() {
  const estaAutenticado = useAuthStore((s) => s.estaAutenticado);
  const ubicacion = useLocation();

  if (!estaAutenticado()) {
    return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />;
  }

  return <Outlet />;
}