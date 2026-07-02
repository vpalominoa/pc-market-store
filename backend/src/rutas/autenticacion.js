import { Router } from 'express';
import * as controladorAuth from '../controladores/autenticacion.js';
import { verificarToken } from '../middlewares/autenticacion.js';
import { limitadorAuth, sanitizarBody } from '../middlewares/seguridad.js';

const router = Router();

router.post('/registro', limitadorAuth, sanitizarBody, controladorAuth.registrar);
router.post('/login', limitadorAuth, sanitizarBody, controladorAuth.login);
router.get('/perfil', verificarToken, controladorAuth.perfil);

export default router;