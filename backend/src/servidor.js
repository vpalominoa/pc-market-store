import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import rutasAutenticacion from './rutas/autenticacion.js';
import rutasProductos from './rutas/productos.js';
import rutasCategorias from './rutas/categorias.js';
import rutasCarrito from './rutas/carrito.js';
import rutasPedidos from './rutas/pedidos.js';
import rutasDirecciones from './rutas/direcciones.js';
import rutasAdmin from './rutas/admin.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PUERTO = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

app.use('/api/auth', rutasAutenticacion);
app.use('/api/productos', rutasProductos);
app.use('/api/categorias', rutasCategorias);
app.use('/api/carrito', rutasCarrito);
app.use('/api/pedidos', rutasPedidos);
app.use('/api/direcciones', rutasDirecciones);
app.use('/api/admin', rutasAdmin);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en puerto ${PUERTO}`);
});