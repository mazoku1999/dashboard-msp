import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateVideoDTO, UpdateVideoDTO } from '../models/video.model';
import { generateSlug } from '../utils/slug.utils';
import { AuthRequest } from '../middleware/auth.middleware';

export const getVideos = async (req: Request, res: Response) => {
    try {
        const [videos] = await pool.execute(`
            SELECT 
                v.id,
                v.titulo as title,
                v.slug,
                v.miniatura as thumbnail,
                v.youtube_id as youtubeId,
                v.descripcion as description,
                u.nombre as author,
                v.fecha_creacion as created_at,
                v.estado as status,
                c.nombre as category
            FROM video v 
            JOIN categoria c ON v.categoria_id = c.id 
            JOIN usuario u ON v.autor_id = u.id
            ORDER BY v.fecha_creacion DESC
        `);

        const response = (videos as any[]).map(video => ({
            id: video.id,
            title: video.title,
            slug: video.slug,
            thumbnail: video.thumbnail,
            youtubeId: video.youtubeId,
            description: video.description,
            author: video.author,
            created_at: video.created_at,
            status: video.status,
            category: video.category
        }));

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener videos:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getVideo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [videos] = await pool.execute(`
            SELECT 
                v.id,
                v.titulo as title,
                v.miniatura as thumbnail,
                v.youtube_id as youtubeId,
                v.descripcion as description,
                u.nombre as author,
                v.fecha_creacion as created_at,
                v.estado as status,
                c.nombre as category
            FROM video v 
            JOIN categoria c ON v.categoria_id = c.id 
            JOIN usuario u ON v.autor_id = u.id 
            WHERE v.id = ?
        `, [id]);

        if (!videos || (videos as any[]).length === 0) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        const video = (videos as any[])[0];
        const response = {
            id: video.id,
            title: video.title,
            slug: video.slug,
            thumbnail: video.thumbnail,
            youtubeId: video.youtubeId,
            description: video.description,
            author: video.author,
            created_at: video.created_at,
            status: video.status,
            category: video.category
        };

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener video:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getVideoBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const [videos] = await pool.execute(`
            SELECT 
                v.id,
                v.titulo as title,
                v.miniatura as thumbnail,
                v.youtube_id as youtubeId,
                v.descripcion as description,
                u.nombre as author,
                v.fecha_creacion as created_at,
                v.estado as status,
                c.nombre as category
            FROM video v 
            JOIN categoria c ON v.categoria_id = c.id 
            JOIN usuario u ON v.autor_id = u.id 
            WHERE v.slug = ?
        `, [slug]);

        if (!videos || (videos as any[]).length === 0) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        const video = (videos as any[])[0];
        const response = {
            id: video.id,
            title: video.title,
            slug: video.slug,
            thumbnail: video.thumbnail,
            youtubeId: video.youtubeId,
            description: video.description,
            author: video.author,
            created_at: video.created_at,
            status: video.status,
            category: video.category
        };

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener video:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createVideo = async (req: AuthRequest, res: Response) => {
    try {
        const videoData: CreateVideoDTO = req.body;
        const autor_id = req.user?.id;

        // Generar slug único
        let slug = generateSlug(videoData.titulo);
        let slugExists = true;
        let counter = 0;

        while (slugExists) {
            const [existing] = await pool.execute(
                'SELECT id FROM video WHERE slug = ?',
                [counter === 0 ? slug : `${slug}-${counter}`]
            );

            if ((existing as any[]).length === 0) {
                slugExists = false;
                if (counter > 0) {
                    slug = `${slug}-${counter}`;
                }
            } else {
                counter++;
            }
        }

        const [result] = await pool.execute(`
            INSERT INTO video (
                titulo, slug, youtube_id, descripcion, miniatura,
                autor_id, categoria_id, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            videoData.titulo,
            slug,
            videoData.youtube_id,
            videoData.descripcion,
            videoData.miniatura,
            autor_id,
            videoData.categoria_id,
            'borrador'
        ]);

        res.status(201).json({
            id: (result as any).insertId,
            ...videoData,
            slug,
            autor_id,
            estado: 'borrador'
        });
    } catch (error) {
        console.error('Error al crear video:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateVideo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates: UpdateVideoDTO = req.body;

        let query = 'UPDATE video SET ';
        const values: any[] = [];
        const updateFields: string[] = [];

        // Mapear todos los campos posibles
        const fields: Record<string, any> = {
            titulo: updates.titulo,
            youtube_id: updates.youtube_id,
            descripcion: updates.descripcion,
            miniatura: updates.miniatura,
            categoria_id: updates.categoria_id,
            estado: updates.estado
        };

        // Añadir solo los campos que están presentes en updates
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined) {
                updateFields.push(`${key} = ?`);
                values.push(value);
            }
        });

        query += updateFields.join(', ') + ' WHERE id = ?';
        values.push(id);

        await pool.execute(query, values);

        res.json({ message: 'Video actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar video:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM video WHERE id = ?', [id]);
        res.json({ message: 'Video eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar video:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const cambiarEstadoVideo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['borrador', 'publicado', 'archivado'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        await pool.execute(
            'UPDATE video SET estado = ? WHERE id = ?',
            [estado, id]
        );

        return res.json({ message: 'Estado de video actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar estado de video:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}; 