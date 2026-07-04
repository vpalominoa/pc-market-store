import api from './api';
import { DatosEnvio } from '../tipos';

export interface Direccion extends DatosEnvio {
  id: string;
  usuario_id: string;
  predeterminada: boolean;
  creado_en: string;
}

export const obtenerDirecciones = async (): Promise<Direccion[]> => {
  const { data } = await api.get('/direcciones');
  return data;
};

export const crearDireccion = async (
  datos: DatosEnvio & { predeterminada?: boolean }
): Promise<Direccion> => {
  const { data } = await api.post('/direcciones', datos);
  return data;
};

export const eliminarDireccion = async (id: string): Promise<void> => {
  await api.delete(`/direcciones/${id}`);
};