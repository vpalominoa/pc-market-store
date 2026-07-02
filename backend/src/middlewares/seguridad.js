import rateLimit from 'express-rate-limit';

export const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const limitadorGeneral = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en un momento' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const validarUUID = (req, res, next) => {
  const { id } = req.params;
  if (id && !/^[a-f0-9-]{36}$/i.test(id)) {
    return res.status(400).json({ error: 'Identificador no válido' });
  }
  next();
};

export const sanitizarBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const clave of Object.keys(req.body)) {
      if (typeof req.body[clave] === 'string') {
        req.body[clave] = req.body[clave].trim();
      }
    }
  }
  next();
};