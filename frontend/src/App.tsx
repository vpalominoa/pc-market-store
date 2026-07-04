import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Encabezado from './componentes/layout/Encabezado';
import PiePagina from './componentes/layout/PiePagina';
import RutaProtegida from './componentes/comunes/RutaProtegida';
import RutaAdmin from './componentes/comunes/RutaAdmin';

import Inicio from './paginas/Inicio';
import Catalogo from './paginas/Catalogo';
import DetalleProducto from './paginas/DetalleProducto';
import Carrito from './paginas/Carrito';
import Checkout from './paginas/Checkout';
import MiCuenta from './paginas/MiCuenta';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import NoEncontrado from './paginas/NoEncontrado';

import PanelAdmin from './paginas/admin/PanelAdmin';
import GestionProductos from './paginas/admin/GestionProductos';
import GestionPedidos from './paginas/admin/GestionPedidos';

export default function App() {
  return (
    <BrowserRouter>
      <Encabezado />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route element={<RutaProtegida />}>
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
            <Route path="/mis-pedidos" element={<Navigate to="/mi-cuenta" replace />} />
          </Route>

          <Route element={<RutaAdmin />}>
            <Route path="/admin" element={<PanelAdmin />} />
            <Route path="/admin/productos" element={<GestionProductos />} />
            <Route path="/admin/pedidos" element={<GestionPedidos />} />
          </Route>

          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      <PiePagina />
    </BrowserRouter>
  );
}