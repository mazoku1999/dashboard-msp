import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { generateToken } from '../utils/jwt.utils';
import { LoginDTO } from '../models/usuario.model';

export const login = async (req: Request, res: Response) => {
    try {
        const { correo, contrasena }: LoginDTO = req.body;

        const [usuarios] = await pool.execute(
            'SELECT id, nombre, correo, contrasena, rol_id, estado FROM usuario WHERE correo = ?',
            [correo]
        );

        if (!usuarios || (usuarios as any[]).length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const usuario = (usuarios as any[])[0];

        if (usuario.estado === 'inactivo') {
            return res.status(401).json({ message: 'Usuario inactivo' });
        }

        const isValidPassword = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        await pool.execute(
            'UPDATE usuario SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?',
            [usuario.id]
        );

        const token = generateToken({
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol_id: usuario.rol_id
        });

        return res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol_id: usuario.rol_id
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const verificarToken = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        const [usuarios] = await pool.execute(
            'SELECT id, nombre, correo, rol_id, estado FROM usuario WHERE id = ?',
            [user.id]
        );

        if (!usuarios || (usuarios as any[]).length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = (usuarios as any[])[0];

        if (usuario.estado === 'inactivo') {
            return res.status(401).json({ message: 'Usuario inactivo' });
        }

        return res.json({
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol_id: usuario.rol_id
            }
        });
    } catch (error) {
        console.error('Error en verificarToken:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}; 