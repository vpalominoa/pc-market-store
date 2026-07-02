import * as servicioPedidos from '../servicios/pedidos.js';

export const crear = async (req, res) => {
  try {
    const pedido = await servicioPedidos.procesarPedido(req.usuario.id);
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo procesar el pedido' });
  }
};

export const misPedidos = async (req, res) => {
  try {
    const pedidos = await servicioPedidos.obtenerPedidosUsuario(req.usuario.id);
    res.json(pedidos);
  } catch {
    res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
  }
};

export const todos = async (req, res) => {
  try {
    const pedidos = await servicioPedidos.obtenerTodosPedidos();
    res.json(pedidos);
  } catch {
    res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
  }
};

export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!estado || typeof estado !== 'string') {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const pedido = await servicioPedidos.cambiarEstado(req.params.id, estado);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo actualizar el estado' });
  }
};