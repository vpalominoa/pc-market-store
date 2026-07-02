import api from './api';
import { FiltrosProducto, Producto, Categoria } from '../tipos';

export const obtenerProductos = async (filtros: FiltrosProducto = {}): Promise<Producto[]> => {
  const { data } = await api.get('/productos', { params: filtros });
  return data;
};

export const obtenerProducto = async (id: string): Promise<Producto> => {
  if (!/^[a-f0-9-]{36}$/i.test(id)) {
    throw new Error('Identificador de producto no válido');
  }
  const { data } = await api.get(`/productos/${id}`);
  return data;
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const { data } = await api.get('/categorias');
  return data;
};