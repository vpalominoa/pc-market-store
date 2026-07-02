import * as repositorioCarrito from '../repositorios/carrito.js';

export const obtenerCarrito = async (usuarioId) => {
  return await repositorioCarrito.obtenerCarrito(usuarioId);
};

export const agregarAlCarrito = async (usuarioId, productoId, cantidad) => {
  if (!cantidad || cantidad < 1 || cantidad > 99) {
    throw new Error('Cantidad no válida');
  }
  return await repositorioCarrito.agregarItem(usuarioId, productoId, cantidad);
};

export const actualizarCantidad = async (itemId, usuarioId, cantidad) => {
  if (!cantidad || cantidad < 1 || cantidad > 99) {
    throw new Error('Cantidad no válida');
  }
  return await repositorioCarrito.actualizarCantidad(itemId, usuarioId, cantidad);
};

export const eliminarDelCarrito = async (itemId, usuarioId) => {
  await repositorioCarrito.eliminarItem(itemId, usuarioId);
};