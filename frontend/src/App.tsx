import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Encabezado from './componentes/layout/Encabezado';
import PiePagina from './componentes/layout/PiePagina';
import RutaProtegida from './componentes/comunes/RutaProtegida';
import RutaAdmin from './componentes/comunes/RutaAdmin';

// Vercel Best Practice: bundle-dynamic-imports (Code Splitting)
const Inicio = lazy(() => import('./paginas/Inicio'));
const Catalogo = lazy(() => import('./paginas/Catalogo'));
const DetalleProducto = lazy(() => import('./paginas/DetalleProducto'));
const Carrito = lazy(() => import('./paginas/Carrito'));
const Checkout = lazy(() => import('./paginas/Checkout'));
const MiCuenta = lazy(() => import('./paginas/MiCuenta'));
const Login = lazy(() => import('./paginas/Login'));
const Registro = lazy(() => import('./paginas/Registro'));
const NoEncontrado = lazy(() => import('./paginas/NoEncontrado'));
const PanelAdmin = lazy(() => import('./paginas/admin/PanelAdmin'));
const GestionProductos = lazy(() => import('./paginas/admin/GestionProductos'));
const GestionPedidos = lazy(() => import('./paginas/admin/GestionPedidos'));

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* A11y: Skip Link */}
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        
        <Encabezado />
        <main id="main-content">
          <Suspense fallback={<div className="loading-spinner">Cargando...</div>}>
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
          </Suspense>
        </main>
        <PiePagina />
      </BrowserRouter>
    </HelmetProvider>
  );
}