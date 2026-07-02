import { Router } from 'express';
import * as controladorPedidos from '../controladores/pedidos.js';
import { verificarToken } from '../middlewares/autenticacion.js';
import { limitadorGeneral, validarUUID } from '../middlewares/seguridad.js';

const router = Router();

router.use(verificarToken);
router.use(limitadorGeneral);

router.post('/', controladorPedidos.crear);
router.get('/mis-pedidos', controladorPedidos.misPedidos);

export default router;