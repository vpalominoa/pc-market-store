import * as repositorioDirecciones from '../repositorios/direcciones.js';

const MAX_DIRECCIONES_POR_USUARIO = 10;

export const obtenerDirecciones = async (usuarioId) => {
  return await repositorioDirecciones.obtenerPorUsuario(usuarioId);
};

export const crearDireccion = async (usuarioId, datos) => {
  const existentes = await repositorioDirecciones.obtenerPorUsuario(usuarioId);
  if (existentes.length >= MAX_DIRECCIONES_POR_USUARIO) {
    throw new Error('Alcanzaste el límite de direcciones guardadas');
  }

  const primeraDireccion = existentes.length === 0;

  return await repositorioDirecciones.crear(usuarioId, {
    ...datos,
    predeterminada: primeraDireccion ? true : !!datos.predeterminada,
  });
};

export const eliminarDireccion = async (id, usuarioId) => {
  await repositorioDirecciones.obtenerPorId(id, usuarioId);
  await repositorioDirecciones.eliminar(id, usuarioId);
};