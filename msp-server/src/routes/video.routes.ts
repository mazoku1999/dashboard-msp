import { Router } from 'express';
import {
    getVideos,
    getVideo,
    getVideoBySlug,
    createVideo,
    updateVideo,
    deleteVideo,
    cambiarEstadoVideo
} from '../controllers/video.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createVideoSchema, updateVideoSchema } from '../schemas/video.schema';

const router = Router();

// Rutas públicas
router.get('/', getVideos);
router.get('/:id', getVideo);
router.get('/slug/:slug', getVideoBySlug);

// Rutas protegidas
router.use(authMiddleware);
router.post('/', validateSchema(createVideoSchema), createVideo);
router.put('/:id', validateSchema(updateVideoSchema), updateVideo);
router.delete('/:id', deleteVideo);
router.put('/:id/estado', authMiddleware, cambiarEstadoVideo);

export default router; 