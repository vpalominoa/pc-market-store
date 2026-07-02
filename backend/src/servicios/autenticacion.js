import jwt from 'jsonwebtoken';
import * as repositorioAuth from '../repositorios/autenticacion.js';

export const registrarUsuario = async (email, password, nombre) => {
  const usuario = await repositorioAuth.registrar(email, password, nombre);
  return usuario;
};

export const iniciarSesion = async (email, password) => {
  const { user, session } = await repositorioAuth.iniciarSesion(email, password);
  const perfil = await repositorioAuth.obtenerPerfil(user.id);

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: perfil.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    usuario: {
      id: user.id,
      nombre: perfil.nombre,
      email: user.email,
      rol: perfil.rol,
    },
  };
};