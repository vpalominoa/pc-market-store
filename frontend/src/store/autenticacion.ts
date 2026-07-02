import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '../tipos';

interface EstadoAuth {
  usuario: Usuario | null;
  token: string | null;
  establecerSesion: (usuario: Usuario, token: string) => void;
  cerrarSesion: () => void;
  estaAutenticado: () => boolean;
  esAdmin: () => boolean;
}

export const useAuthStore = create<EstadoAuth>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      establecerSesion: (usuario, token) => set({ usuario, token }),
      cerrarSesion: () => set({ usuario: null, token: null }),
      estaAutenticado: () => !!get().token && !!get().usuario,
      esAdmin: () => get().usuario?.rol === 'admin',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ usuario: state.usuario, token: state.token }),
    }
  )
);