import * as servicioDirecciones from '../servicios/direcciones.js';

export const obtener = async (req, res) => {
  try {
    const direcciones = await servicioDirecciones.obtenerDirecciones(req.usuario.id);
    res.json(direcciones);
  } catch {
    res.status(500).json({ error: 'No se pudieron obtener las direcciones' });
  }
};

export const crear = async (req, res) => {
  try {
    const { direccion, ciudad, referencia, telefono, predeterminada } = req.body;

    if (!direccion || typeof direccion !== 'string' || direccion.trim().length < 5) {
      return res.status(400).json({ error: 'Ingresa una dirección válida' });
    }
    if (!ciudad || typeof ciudad !== 'string' || ciudad.trim().length < 2) {
      return res.status(400).json({ error: 'Ingresa una ciudad válida' });
    }
    if (!telefono || typeof telefono !== 'string' || !/^[0-9+\s-]{6,15}$/.test(telefono.trim())) {
      return res.status(400).json({ error: 'Ingresa un teléfono válido' });
    }
    if (referencia && (typeof referencia !== 'string' || referencia.length > 200)) {
      return res.status(400).json({ error: 'La referencia no puede superar los 200 caracteres' });
    }

    const nuevaDireccion = await servicioDirecciones.crearDireccion(req.usuario.id, {
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      referencia: referencia ? referencia.trim() : null,
      telefono: telefono.trim(),
      predeterminada: !!predeterminada,
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo guardar la dirección' });
  }
};

export const eliminar = async (req, res) => {
  try {
    await servicioDirecciones.eliminarDireccion(req.params.id, req.usuario.id);
    res.json({ mensaje: 'Dirección eliminada' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo eliminar la dirección' });
  }
};