import { z } from 'zod';

export const createVideoSchema = z.object({
    body: z.object({
        titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
        youtube_id: z.string().min(11, 'ID de YouTube inválido'),
        descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
        miniatura: z.string().url('URL de miniatura inválida'),
        categoria_id: z.number().int().positive()
    })
});

export const updateVideoSchema = z.object({
    body: z.object({
        titulo: z.string().min(5).optional(),
        youtube_id: z.string().min(11).optional(),
        descripcion: z.string().min(10).optional(),
        miniatura: z.string().url().optional(),
        categoria_id: z.number().int().positive().optional(),
        estado: z.enum(['borrador', 'publicado', 'archivado']).optional()
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'ID debe ser un número')
    })
}); 