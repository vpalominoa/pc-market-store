import * as repositorioProductos from '../repositorios/productos.js';

export const listarProductos = async (filtros) => {
  return await repositorioProductos.obtenerTodos(filtros);
};

export const obtenerProducto = async (id) => {
  const producto = await repositorioProductos.obtenerPorId(id);
  if (!producto) throw new Error('Producto no encontrado');
  return producto;
};

export const crearProducto = async (datos) => {
  if (!datos.nombre || datos.nombre.length < 3) throw new Error('Nombre inválido');
  if (!datos.precio || datos.precio <= 0) throw new Error('Precio inválido');
  if (datos.stock < 0) throw new Error('Stock inválido');
  return await repositorioProductos.crear(datos);
};

export const editarProducto = async (id, datos) => {
  if (datos.precio !== undefined && datos.precio <= 0) throw new Error('Precio inválido');
  if (datos.stock !== undefined && datos.stock < 0) throw new Error('Stock inválido');
  return await repositorioProductos.actualizar(id, datos);
};

export const desactivarProducto = async (id) => {
  await repositorioProductos.desactivar(id);
};