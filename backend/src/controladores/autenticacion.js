import * as servicioAuth from '../servicios/autenticacion.js';

export const registrar = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 6 y 72 caracteres' });
    }

    if (typeof nombre !== 'string' || nombre.length < 2 || nombre.length > 100) {
      return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
    }

    const usuario = await servicioAuth.registrarUsuario(
      email.toLowerCase().trim(),
      password,
      nombre.trim()
    );

    res.status(201).json({ mensaje: 'Cuenta creada. Revisa tu correo para confirmarla.', usuario });
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la cuenta' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const resultado = await servicioAuth.iniciarSesion(
      email.toLowerCase().trim(),
      password
    );

    res.json(resultado);
  } catch (error) {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
};

export const perfil = async (req, res) => {
  res.json(req.usuario);
};