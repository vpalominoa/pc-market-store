import { Router } from 'express';
import * as controladorPedidos from '../controladores/pedidos.js';
import { verificarToken, verificarAdmin } from '../middlewares/autenticacion.js';
import { limitadorGeneral, validarUUID, sanitizarBody } from '../middlewares/seguridad.js';

const router = Router();

router.use(verificarToken);
router.use(verificarAdmin);
router.use(limitadorGeneral);

router.get('/pedidos', controladorPedidos.todos);
router.put('/pedidos/:id/estado', validarUUID, sanitizarBody, controladorPedidos.actualizarEstado);

export default router;