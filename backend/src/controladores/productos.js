import * as servicioProductos from '../servicios/productos.js';

export const listar = async (req, res) => {
  try {
    const { categoriaId, orden, busqueda, todos } = req.query;

    const filtros = {
      categoriaId: categoriaId || undefined,
      orden: ['precio_asc', 'precio_desc'].includes(orden) ? orden : undefined,
      busqueda: busqueda ? String(busqueda).slice(0, 100) : undefined,
      todos: todos === 'true',
    };

    const productos = await servicioProductos.listarProductos(filtros);
    res.json(productos);
  } catch {
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};

export const obtener = async (req, res) => {
  try {
    const producto = await servicioProductos.obtenerProducto(req.params.id);
    res.json(producto);
  } catch {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
};

export const crear = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id, especificaciones } = req.body;

    const producto = await servicioProductos.crearProducto({
      nombre,
      descripcion: descripcion || '',
      precio: Number(precio),
      stock: Number(stock),
      imagen_url: imagen_url || '',
      categoria_id,
      especificaciones: especificaciones || {},
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo crear el producto' });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id, especificaciones } = req.body;

    const datos = {};
    if (nombre !== undefined) datos.nombre = nombre;
    if (descripcion !== undefined) datos.descripcion = descripcion;
    if (precio !== undefined) datos.precio = Number(precio);
    if (stock !== undefined) datos.stock = Number(stock);
    if (imagen_url !== undefined) datos.imagen_url = imagen_url;
    if (categoria_id !== undefined) datos.categoria_id = categoria_id;
    if (especificaciones !== undefined) datos.especificaciones = especificaciones;

    const producto = await servicioProductos.editarProducto(req.params.id, datos);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo actualizar el producto' });
  }
};

export const eliminar = async (req, res) => {
  try {
    await servicioProductos.desactivarProducto(req.params.id);
    res.json({ mensaje: 'Producto desactivado correctamente' });
  } catch {
    res.status(400).json({ error: 'No se pudo desactivar el producto' });
  }
};