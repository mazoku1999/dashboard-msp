import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        correo: z.string().email('Correo electrónico inválido'),
        contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
    })
}); 