import { z } from 'zod';

export const createCategoriaSchema = z.object({
    body: z.object({
        nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
        descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres')
    })
});

export const updateCategoriaSchema = z.object({
    body: z.object({
        nombre: z.string().min(3).optional(),
        descripcion: z.string().min(10).optional(),
        estado: z.enum(['activo', 'inactivo']).optional()
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'ID debe ser un número')
    })
}); 