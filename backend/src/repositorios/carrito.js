import { supabase } from '../db/supabase.js';

export const obtenerCarrito = async (usuarioId) => {
  const { data, error } = await supabase
    .from('items_carrito')
    .select('*, productos(id, nombre, precio, imagen_url, stock)')
    .eq('usuario_id', usuarioId);
  if (error) throw new Error(error.message);
  return data;
};

export const agregarItem = async (usuarioId, productoId, cantidad) => {
  const { data: existente } = await supabase
    .from('items_carrito')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('producto_id', productoId)
    .single();

  if (existente) {
    const { data, error } = await supabase
      .from('items_carrito')
      .update({ cantidad: existente.cantidad + cantidad })
      .eq('id', existente.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase
    .from('items_carrito')
    .insert({ usuario_id: usuarioId, producto_id: productoId, cantidad })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const actualizarCantidad = async (itemId, usuarioId, cantidad) => {
  const { data, error } = await supabase
    .from('items_carrito')
    .update({ cantidad })
    .eq('id', itemId)
    .eq('usuario_id', usuarioId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const eliminarItem = async (itemId, usuarioId) => {
  const { error } = await supabase
    .from('items_carrito')
    .delete()
    .eq('id', itemId)
    .eq('usuario_id', usuarioId);
  if (error) throw new Error(error.message);
};

export const vaciarCarrito = async (usuarioId) => {
  const { error } = await supabase
    .from('items_carrito')
    .delete()
    .eq('usuario_id', usuarioId);
  if (error) throw new Error(error.message);
};