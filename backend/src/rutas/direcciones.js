import { Router } from 'express';
import * as controladorDirecciones from '../controladores/direcciones.js';
import { verificarToken } from '../middlewares/autenticacion.js';
import { limitadorGeneral, validarUUID, sanitizarBody } from '../middlewares/seguridad.js';

const router = Router();

router.use(verificarToken);
router.use(limitadorGeneral);

router.get('/', controladorDirecciones.obtener);
router.post('/', sanitizarBody, controladorDirecciones.crear);
router.delete('/:id', validarUUID, controladorDirecciones.eliminar);

export default router;