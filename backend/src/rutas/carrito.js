import { Router } from 'express';
import * as controladorCarrito from '../controladores/carrito.js';
import { verificarToken } from '../middlewares/autenticacion.js';
import { limitadorGeneral, validarUUID, sanitizarBody } from '../middlewares/seguridad.js';

const router = Router();

router.use(verificarToken);
router.use(limitadorGeneral);

router.get('/', controladorCarrito.obtener);
router.post('/', sanitizarBody, controladorCarrito.agregar);
router.put('/:id', validarUUID, sanitizarBody, controladorCarrito.actualizar);
router.delete('/:id', validarUUID, controladorCarrito.eliminar);

export default router;