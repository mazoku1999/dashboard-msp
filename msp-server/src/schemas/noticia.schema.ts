import { z } from 'zod';

export const createNoticiaSchema = z.object({
    body: z.object({
        titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
        extracto: z.string().min(10, 'El extracto debe tener al menos 10 caracteres'),
        contenido: z.string().min(50, 'El contenido debe tener al menos 50 caracteres'),
        imagen: z.string().url('URL de imagen inválida'),
        categoria_id: z.number().int().positive(),
        video_id: z.string().optional(),
        video_titulo: z.string().optional(),
        video_descripcion: z.string().optional()
    })
});

export const updateNoticiaSchema = z.object({
    body: z.object({
        titulo: z.string().min(5).optional(),
        extracto: z.string().min(10).optional(),
        contenido: z.string().min(50).optional(),
        imagen: z.string().url().optional(),
        categoria_id: z.number().int().positive().optional(),
        estado: z.enum(['borrador', 'publicado', 'archivado']).optional(),
        video_id: z.string().optional(),
        video_titulo: z.string().optional(),
        video_descripcion: z.string().optional()
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'ID debe ser un número')
    })
}); 