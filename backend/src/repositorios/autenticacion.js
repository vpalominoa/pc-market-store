import { supabase, supabasePublico } from '../db/supabase.js';

export const registrar = async (email, password, nombre) => {
  const { data, error } = await supabasePublico.auth.signUp({
    email,
    password,
    options: {
      data: { nombre }
    }
  });
  if (error) throw new Error(error.message);
  return data.user;
};

export const iniciarSesion = async (email, password) => {
  const { data, error } = await supabasePublico.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
};

export const obtenerPerfil = async (usuarioId) => {
  
  const { data, error, count } = await supabase
    .from('perfiles')
    .select('*', { count: 'exact' })
    .eq('id', usuarioId);
  
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Perfil no encontrado');
  
  return data[0];
};