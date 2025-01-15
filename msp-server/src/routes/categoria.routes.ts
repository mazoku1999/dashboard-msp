import { Router } from 'express';
import {
    getCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    cambiarEstadoCategoria
} from '../controllers/categoria.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createCategoriaSchema, updateCategoriaSchema } from '../schemas/categoria.schema';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoria);

// Proteger rutas de modificación
router.use(authMiddleware);
router.post('/', validateSchema(createCategoriaSchema), createCategoria);
router.put('/:id', validateSchema(updateCategoriaSchema), updateCategoria);
router.delete('/:id', deleteCategoria);
router.put('/:id/estado', authMiddleware, cambiarEstadoCategoria);

export default router; 