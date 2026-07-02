import { Router } from 'express';
import * as controladorProductos from '../controladores/productos.js';
import { verificarToken, verificarAdmin } from '../middlewares/autenticacion.js';
import { limitadorGeneral, validarUUID, sanitizarBody } from '../middlewares/seguridad.js';

const router = Router();

router.get('/', limitadorGeneral, controladorProductos.listar);
router.get('/:id', limitadorGeneral, validarUUID, controladorProductos.obtener);
router.post('/', verificarToken, verificarAdmin, sanitizarBody, controladorProductos.crear);
router.put('/:id', verificarToken, verificarAdmin, validarUUID, sanitizarBody, controladorProductos.actualizar);
router.delete('/:id', verificarToken, verificarAdmin, validarUUID, controladorProductos.eliminar);

export default router;