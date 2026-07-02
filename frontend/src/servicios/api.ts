import axios from 'axios';
import { useAuthStore } from '../store/autenticacion';

const URL_BASE = import.meta.env.VITE_API_URL;

if (!URL_BASE) {
  throw new Error('VITE_API_URL no está configurada');
}

const api = axios.create({
  baseURL: URL_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().cerrarSesion();
    }
    const mensaje = error.response?.data?.error || 'Ocurrió un error inesperado';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;