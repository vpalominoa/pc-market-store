import { supabase } from '../db/supabase.js';

export const obtenerTodos = async ({ categoriaId, orden, busqueda, todos } = {}) => {
  let query = supabase
    .from('productos')
    .select('*, categorias(nombre)');

  if (!todos) query = query.eq('activo', true);
  if (categoriaId) query = query.eq('categoria_id', categoriaId);
  if (busqueda) query = query.ilike('nombre', `%${busqueda}%`);

  if (orden === 'precio_asc') query = query.order('precio', { ascending: true });
  else if (orden === 'precio_desc') query = query.order('precio', { ascending: false });
  else query = query.order('creado_en', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const obtenerPorId = async (id) => {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const crear = async (producto) => {
  const { data, error } = await supabase
    .from('productos')
    .insert(producto)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const actualizar = async (id, producto) => {
  const { data, error } = await supabase
    .from('productos')
    .update(producto)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const desactivar = async (id) => {
  const { error } = await supabase
    .from('productos')
    .update({ activo: false })
    .eq('id', id);
  if (error) throw new Error(error.message);
};