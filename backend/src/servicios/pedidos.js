import * as repositorioPedidos from '../repositorios/pedidos.js';
import * as repositorioCarrito from '../repositorios/carrito.js';
import { supabase } from '../db/supabase.js';

const ESTADOS_VALIDOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

export const procesarPedido = async (usuarioId) => {
  const itemsCarrito = await repositorioCarrito.obtenerCarrito(usuarioId);

  if (!itemsCarrito.length) {
    throw new Error('El carrito está vacío');
  }

  for (const item of itemsCarrito) {
    if (item.productos.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para: ${item.productos.nombre}`);
    }
  }

  const total = itemsCarrito.reduce(
    (acc, item) => acc + item.productos.precio * item.cantidad,
    0
  );

  const tiempoVenta = await repositorioPedidos.crearTiempoVenta();
  const pedido = await repositorioPedidos.crearPedido(usuarioId, total, tiempoVenta.id);

  await repositorioPedidos.agregarItems(
    pedido.id,
    itemsCarrito.map((item) => ({
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.productos.precio,
    }))
  );

  for (const item of itemsCarrito) {
    await supabase
      .from('productos')
      .update({ stock: item.productos.stock - item.cantidad })
      .eq('id', item.producto_id);
  }

  await repositorioCarrito.vaciarCarrito(usuarioId);

  return pedido;
};

export const obtenerPedidosUsuario = async (usuarioId) => {
  return await repositorioPedidos.obtenerPorUsuario(usuarioId);
};

export const obtenerTodosPedidos = async () => {
  return await repositorioPedidos.obtenerTodos();
};

export const cambiarEstado = async (id, estado) => {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error('Estado no válido');
  }

  const pedidoActual = await repositorioPedidos.obtenerPorId(id);

  const seEstaCancelando = estado === 'cancelado' && pedidoActual.estado !== 'cancelado';

  if (seEstaCancelando) {
    for (const item of pedidoActual.items_pedido) {
      await supabase
        .from('productos')
        .update({ stock: item.productos.stock + item.cantidad })
        .eq('id', item.producto_id);
    }
  }

  return await repositorioPedidos.actualizarEstado(id, estado);
};