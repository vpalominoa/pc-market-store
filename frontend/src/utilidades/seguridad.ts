export const sanitizarTexto = (valor: string): string => {
  return valor
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
  return regex.test(email) && email.length <= 254;
};

export const validarPassword = (password: string): string | null => {
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (password.length > 72) return 'La contraseña no puede superar los 72 caracteres';
  return null;
};

export const validarNombre = (nombre: string): string | null => {
  const limpio = nombre.trim();
  if (limpio.length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (limpio.length > 100) return 'El nombre no puede superar los 100 caracteres';
  if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(limpio)) return 'El nombre solo puede contener letras';
  return null;
};

export const validarCantidad = (cantidad: number, stockDisponible: number): string | null => {
  if (!Number.isInteger(cantidad) || cantidad < 1) return 'La cantidad debe ser mayor a 0';
  if (cantidad > 99) return 'La cantidad máxima por producto es 99';
  if (cantidad > stockDisponible) return 'No hay suficiente stock disponible';
  return null;
};

export const formatearPrecio = (precio: number): string =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(precio);

export const esUrlSegura = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};