import api from './api';

export const obtenerEstadisticas = async () => {
  const { data } = await api.get('/admin/estadisticas');
  return data;
};

export const obtenerTodosPedidos = async () => {
  const { data } = await api.get('/admin/pedidos');
  return data;
};

export const actualizarEstadoPedido = async (id: string, estado: string) => {
  const ESTADOS_VALIDOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
  if (!ESTADOS_VALIDOS.includes(estado)) throw new Error('Estado no válido');
  const { data } = await api.put(`/admin/pedidos/${id}/estado`, { estado });
  return data;
};

export const obtenerProductosAdmin = async () => {
  const { data } = await api.get('/productos?todos=true');
  return data;
};

export const crearProducto = async (producto: FormData | Record<string, unknown>) => {
  const { data } = await api.post('/productos', producto);
  return data;
};

export const editarProducto = async (id: string, producto: Record<string, unknown>) => {
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error('ID de producto no válido');
  const { data } = await api.put(`/productos/${id}`, producto);
  return data;
};

export const desactivarProducto = async (id: string) => {
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error('ID de producto no válido');
  await api.delete(`/productos/${id}`);
};