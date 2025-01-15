import { Router } from 'express';
import {
    getUsuarios,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    cambiarEstadoUsuario
} from '../controllers/usuario.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createUsuarioSchema, updateUsuarioSchema } from '../schemas/usuario.schema';

const router = Router();

// Proteger todas las rutas
router.use(authMiddleware);

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', validateSchema(createUsuarioSchema), createUsuario);
router.put('/:id', validateSchema(updateUsuarioSchema), updateUsuario);
router.delete('/:id', deleteUsuario);
router.put('/:id/estado', authMiddleware, cambiarEstadoUsuario);

export default router; 