import { supabase } from '../db/supabase.js';

export const crearTiempoVenta = async () => {
  const ahora = new Date();
  const { data, error } = await supabase
    .from('tiempo_ventas')
    .insert({
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().split(' ')[0],
      dia_semana: ahora.toLocaleDateString('es-PE', { weekday: 'long' }),
      mes: ahora.toLocaleDateString('es-PE', { month: 'long' }),
      anio: ahora.getFullYear(),
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const crearPedido = async (usuarioId, total, tiempoVentaId) => {
  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      usuario_id: usuarioId,
      total,
      estado: 'pendiente',
      tiempo_venta_id: tiempoVentaId,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const agregarItems = async (pedidoId, items) => {
  const { error } = await supabase
    .from('items_pedido')
    .insert(
      items.map((i) => ({
        pedido_id: pedidoId,
        producto_id: i.producto_id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
      }))
    );
  if (error) throw new Error(error.message);
};

export const obtenerPorUsuario = async (usuarioId) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, items_pedido(*, productos(nombre, imagen_url)), tiempo_ventas(*)')
    .eq('usuario_id', usuarioId)
    .order('creado_en', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const obtenerTodos = async () => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, items_pedido(*, productos(nombre, imagen_url)), tiempo_ventas(*)')
    .order('creado_en', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const actualizarEstado = async (id, estado) => {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};