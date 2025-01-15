import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from '../models/usuario.model';

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const [usuarios] = await pool.execute(
            'SELECT id, nombre, correo, rol_id, estado, ultimo_acceso, fecha_creacion FROM usuario'
        );
        return res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [usuarios] = await pool.execute(
            'SELECT id, nombre, correo, rol_id, estado, ultimo_acceso, fecha_creacion FROM usuario WHERE id = ?',
            [id]
        );

        if (!usuarios || (usuarios as any[]).length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json((usuarios as any[])[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, contrasena, rol_id }: CreateUsuarioDTO = req.body;

        const [existente] = await pool.execute(
            'SELECT id FROM usuario WHERE correo = ?',
            [correo]
        );

        if ((existente as any[]).length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const [result] = await pool.execute(
            'INSERT INTO usuario (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)',
            [nombre, correo, hashedPassword, rol_id]
        );

        return res.status(201).json({
            id: (result as any).insertId,
            nombre,
            correo,
            rol_id
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates: UpdateUsuarioDTO = req.body;

        if (updates.correo) {
            const [existente] = await pool.execute(
                'SELECT id FROM usuario WHERE correo = ? AND id != ?',
                [updates.correo, id]
            );

            if ((existente as any[]).length > 0) {
                return res.status(400).json({ message: 'El correo ya está registrado' });
            }
        }

        let query = 'UPDATE usuario SET ';
        const values: any[] = [];
        const updateFields: string[] = [];

        if (updates.nombre) {
            updateFields.push('nombre = ?');
            values.push(updates.nombre);
        }
        if (updates.correo) {
            updateFields.push('correo = ?');
            values.push(updates.correo);
        }
        if (updates.contrasena) {
            updateFields.push('contrasena = ?');
            values.push(await bcrypt.hash(updates.contrasena, 10));
        }
        if (updates.rol_id) {
            updateFields.push('rol_id = ?');
            values.push(updates.rol_id);
        }
        if (updates.estado) {
            updateFields.push('estado = ?');
            values.push(updates.estado);
        }

        query += updateFields.join(', ') + ' WHERE id = ?';
        values.push(id);

        await pool.execute(query, values);

        return res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);
        return res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const cambiarEstadoUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        await pool.execute(
            'UPDATE usuario SET estado = ? WHERE id = ?',
            [estado, id]
        );

        return res.json({ message: 'Estado de usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar estado de usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}; 