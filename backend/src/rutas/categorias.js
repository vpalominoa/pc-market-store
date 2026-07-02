import { Router } from 'express';
import { supabase } from '../db/supabase.js';
import { limitadorGeneral } from '../middlewares/seguridad.js';

const router = Router();

router.get('/', limitadorGeneral, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre');

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: 'No se pudieron obtener las categorías' });
  }
});

export default router;