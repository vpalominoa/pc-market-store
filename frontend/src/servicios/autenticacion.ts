import api from './api';
import { validarEmail, validarPassword, validarNombre } from '../utilidades/seguridad';

export const registrar = async (nombre: string, email: string, password: string) => {
  const errorNombre = validarNombre(nombre);
  if (errorNombre) throw new Error(errorNombre);

  if (!validarEmail(email)) throw new Error('Correo electrónico no válido');

  const errorPassword = validarPassword(password);
  if (errorPassword) throw new Error(errorPassword);

  const { data } = await api.post('/auth/registro', {
    nombre: nombre.trim(),
    email: email.toLowerCase().trim(),
    password,
  });
  return data;
};

export const login = async (email: string, password: string) => {
  if (!validarEmail(email)) throw new Error('Correo electrónico no válido');
  if (!password) throw new Error('Ingresa tu contraseña');

  const { data } = await api.post('/auth/login', {
    email: email.toLowerCase().trim(),
    password,
  });
  return data;
};