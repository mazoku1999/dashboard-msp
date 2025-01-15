import { Router } from 'express';
import { login, verificarToken } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validateSchema(loginSchema), login);
router.get('/verify', authMiddleware, verificarToken);

export default router; 