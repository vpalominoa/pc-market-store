import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/autenticacion';

export default function RutaAdmin() {
  const { estaAutenticado, esAdmin } = useAuthStore();
  const ubicacion = useLocation();

  if (!estaAutenticado()) {
    return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />;
  }

  if (!esAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}