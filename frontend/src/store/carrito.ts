import { create } from 'zustand';
import { ItemCarrito } from '../tipos';

interface EstadoCarrito {
  items: ItemCarrito[];
  establecerItems: (items: ItemCarrito[]) => void;
  limpiar: () => void;
  totalItems: () => number;
  totalPrecio: () => number;
}

export const useCarritoStore = create<EstadoCarrito>((set, get) => ({
  items: [],
  establecerItems: (items) => set({ items }),
  limpiar: () => set({ items: [] }),
  totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
  totalPrecio: () =>
    get().items.reduce((acc, i) => acc + i.productos.precio * i.cantidad, 0),
}));