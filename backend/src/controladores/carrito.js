import * as servicioCarrito from '../servicios/carrito.js';

export const obtener = async (req, res) => {
  try {
    const items = await servicioCarrito.obtenerCarrito(req.usuario.id);
    res.json(items);
  } catch {
    res.status(500).json({ error: 'No se pudo obtener el carrito' });
  }
};

export const agregar = async (req, res) => {
  try {
    const { producto_id, cantidad } = req.body;

    if (!producto_id || typeof producto_id !== 'string') {
      return res.status(400).json({ error: 'Producto no válido' });
    }

    const cantidadNum = Number(cantidad);
    if (!Number.isInteger(cantidadNum) || cantidadNum < 1 || cantidadNum > 99) {
      return res.status(400).json({ error: 'Cantidad no válida' });
    }

    const item = await servicioCarrito.agregarAlCarrito(
      req.usuario.id,
      producto_id,
      cantidadNum
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo agregar al carrito' });
  }
};

export const actualizar = async (req, res) => {
  try {
    const cantidadNum = Number(req.body.cantidad);

    if (!Number.isInteger(cantidadNum) || cantidadNum < 1 || cantidadNum > 99) {
      return res.status(400).json({ error: 'Cantidad no válida' });
    }

    const item = await servicioCarrito.actualizarCantidad(
      req.params.id,
      req.usuario.id,
      cantidadNum
    );
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo actualizar la cantidad' });
  }
};

export const eliminar = async (req, res) => {
  try {
    await servicioCarrito.eliminarDelCarrito(req.params.id, req.usuario.id);
    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch {
    res.status(400).json({ error: 'No se pudo eliminar el producto del carrito' });
  }
};