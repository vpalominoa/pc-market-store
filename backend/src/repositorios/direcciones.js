import { supabase } from '../db/supabase.js';

export const obtenerPorUsuario = async (usuarioId) => {
  const { data, error } = await supabase
    .from('direcciones')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('predeterminada', { ascending: false })
    .order('creado_en', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const crear = async (usuarioId, datos) => {
  if (datos.predeterminada) {
    await quitarPredeterminada(usuarioId);
  }

  const { data, error } = await supabase
    .from('direcciones')
    .insert({
      usuario_id: usuarioId,
      direccion: datos.direccion,
      ciudad: datos.ciudad,
      referencia: datos.referencia,
      telefono: datos.telefono,
      predeterminada: !!datos.predeterminada,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const eliminar = async (id, usuarioId) => {
  const { error } = await supabase
    .from('direcciones')
    .delete()
    .eq('id', id)
    .eq('usuario_id', usuarioId);
  if (error) throw new Error(error.message);
};

export const quitarPredeterminada = async (usuarioId) => {
  const { error } = await supabase
    .from('direcciones')
    .update({ predeterminada: false })
    .eq('usuario_id', usuarioId)
    .eq('predeterminada', true);
  if (error) throw new Error(error.message);
};

export const obtenerPorId = async (id, usuarioId) => {
  const { data, error } = await supabase
    .from('direcciones')
    .select('*')
    .eq('id', id)
    .eq('usuario_id', usuarioId)
    .single();
  if (error) throw new Error('Dirección no encontrada');
  return data;
};