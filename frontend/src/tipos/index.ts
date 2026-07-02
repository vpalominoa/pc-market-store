export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  categoria_id: string;
  especificaciones: Record<string, string>;
  activo: boolean;
  creado_en: string;
  categorias?: { nombre: string };
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin';
}

export interface ItemCarrito {
  id: string;
  usuario_id: string;
  producto_id: string;
  cantidad: number;
  productos: Producto;
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  productos: Producto;
}

export interface TiempoVenta {
  id: string;
  fecha: string;
  hora: string;
  dia_semana: string;
  mes: string;
  anio: number;
}

export type EstadoPedido = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';

export interface Pedido {
  id: string;
  usuario_id: string;
  total: number;
  estado: EstadoPedido;
  tiempo_venta_id: string;
  creado_en: string;
  items_pedido: ItemPedido[];
  tiempo_ventas: TiempoVenta;
}

export interface FiltrosProducto {
  categoriaId?: string;
  orden?: 'precio_asc' | 'precio_desc';
  busqueda?: string;
}