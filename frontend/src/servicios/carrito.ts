import api from './api';
import { validarCantidad } from '../utilidades/seguridad';
import { DatosEnvio } from '../tipos';

export const obtenerCarrito = async () => {
  const { data } = await api.get('/carrito');
  return data;
};

export const agregarAlCarrito = async (productoId: string, cantidad: number, stockDisponible: number) => {
  const error = validarCantidad(cantidad, stockDisponible);
  if (error) throw new Error(error);

  const { data } = await api.post('/carrito', { producto_id: productoId, cantidad });
  return data;
};

export const actualizarCantidad = async (id: string, cantidad: number, stockDisponible: number) => {
  const error = validarCantidad(cantidad, stockDisponible);
  if (error) throw new Error(error);

  const { data } = await api.put(`/carrito/${id}`, { cantidad });
  return data;
};

export const eliminarDelCarrito = async (id: string) => {
  await api.delete(`/carrito/${id}`);
};

export const crearPedido = async (datosEnvio: DatosEnvio) => {
  const { data } = await api.post('/pedidos', datosEnvio);
  return data;
};

export const obtenerMisPedidos = async () => {
  const { data } = await api.get('/pedidos/mis-pedidos');
  return data;
};

