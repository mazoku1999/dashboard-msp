import { z } from 'zod';

export const createUsuarioSchema = z.object({
    body: z.object({
        nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
        correo: z.string().email('Correo electrónico inválido'),
        contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        rol_id: z.number().int().positive()
    })
});

export const updateUsuarioSchema = z.object({
    body: z.object({
        nombre: z.string().min(3).optional(),
        correo: z.string().email().optional(),
        contrasena: z.string().min(6).optional(),
        rol_id: z.number().int().positive().optional(),
        estado: z.enum(['activo', 'inactivo']).optional()
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'ID debe ser un número')
    })
}); 