import { Router } from 'express';
import {
    getNoticias,
    getNoticia,
    getNoticiaBySlug,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    cambiarEstadoNoticia
} from '../controllers/noticia.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createNoticiaSchema, updateNoticiaSchema } from '../schemas/noticia.schema';

const router = Router();

// Rutas públicas
router.get('/', getNoticias);
router.get('/:id', getNoticia);
router.get('/slug/:slug', getNoticiaBySlug);

// Rutas protegidas
router.use(authMiddleware);
router.post('/', validateSchema(createNoticiaSchema), createNoticia);
router.put('/:id', validateSchema(updateNoticiaSchema), updateNoticia);
router.delete('/:id', deleteNoticia);
router.put('/:id/estado', authMiddleware, cambiarEstadoNoticia);

export default router; 