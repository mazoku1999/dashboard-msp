import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateNoticiaDTO, UpdateNoticiaDTO } from '../models/noticia.model';
import { generateSlug } from '../utils/slug.utils';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNoticias = async (req: Request, res: Response) => {
    try {
        const [noticias] = await pool.execute(`
            SELECT 
                n.id,
                n.titulo as title,
                n.slug,
                n.extracto as excerpt,
                n.contenido as content,
                n.imagen as image,
                u.nombre as author,
                n.fecha_creacion as created_at,
                n.estado as status,
                c.nombre as category,
                n.video_id,
                n.video_titulo as video_title,
                n.video_descripcion as video_description
            FROM noticia n 
            JOIN categoria c ON n.categoria_id = c.id 
            JOIN usuario u ON n.autor_id = u.id
            ORDER BY n.fecha_creacion DESC
        `);

        const response = (noticias as any[]).map(noticia => ({
            id: noticia.id,
            title: noticia.title,
            slug: noticia.slug,
            excerpt: noticia.excerpt,
            content: noticia.content,
            image: noticia.image,
            author: noticia.author,
            created_at: noticia.created_at,
            status: noticia.status,
            category: noticia.category,
            video: noticia.video_id ? {
                id: noticia.video_id,
                title: noticia.video_title,
                description: noticia.video_description
            } : undefined
        }));

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getNoticia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [noticias] = await pool.execute(`
            SELECT 
                n.id,
                n.titulo as title,
                n.slug,
                n.extracto as excerpt,
                n.contenido as content,
                n.imagen as image,
                u.nombre as author,
                n.fecha_creacion as created_at,
                n.estado as status,
                c.nombre as category,
                n.categoria_id,
                n.video_id,
                n.video_titulo as video_title,
                n.video_descripcion as video_description
            FROM noticia n 
            JOIN categoria c ON n.categoria_id = c.id 
            JOIN usuario u ON n.autor_id = u.id 
            WHERE n.id = ?
        `, [id]);

        if (!noticias || (noticias as any[]).length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        const noticia = (noticias as any[])[0];

        // Formatear la respuesta según la interfaz News
        const response = {
            id: noticia.id,
            title: noticia.title,
            slug: noticia.slug,
            excerpt: noticia.excerpt,
            content: noticia.content,
            image: noticia.image,
            author: noticia.author,
            created_at: noticia.created_at,
            status: noticia.status,
            category: noticia.category,
            categoria_id: noticia.categoria_id,
            video: noticia.video_id ? {
                id: noticia.video_id,
                title: noticia.video_title,
                description: noticia.video_description
            } : undefined
        };

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getNoticiaBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const [noticias] = await pool.execute(`
            SELECT 
                n.id,
                n.titulo as title,
                n.slug,
                n.extracto as excerpt,
                n.contenido as content,
                n.imagen as image,
                u.nombre as author,
                n.fecha_creacion as created_at,
                n.estado as status,
                c.nombre as category,
                n.video_id,
                n.video_titulo as video_title,
                n.video_descripcion as video_description
            FROM noticia n 
            JOIN categoria c ON n.categoria_id = c.id 
            JOIN usuario u ON n.autor_id = u.id 
            WHERE n.slug = ?
        `, [slug]);

        if (!noticias || (noticias as any[]).length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        const noticia = (noticias as any[])[0];

        // Formatear la respuesta según la interfaz News
        const response = {
            id: noticia.id,
            title: noticia.title,
            slug: noticia.slug,
            excerpt: noticia.excerpt,
            content: noticia.content,
            image: noticia.image,
            author: noticia.author,
            created_at: noticia.created_at,
            status: noticia.status,
            category: noticia.category,
            categoria_id: noticia.categoria_id,
            video: noticia.video_id ? {
                id: noticia.video_id,
                title: noticia.video_title,
                description: noticia.video_description
            } : undefined
        };

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createNoticia = async (req: AuthRequest, res: Response) => {
    try {
        const noticiaData: CreateNoticiaDTO = req.body;
        const autor_id = req.user?.id;

        // Generar slug único
        let slug = generateSlug(noticiaData.titulo);
        let slugExists = true;
        let counter = 0;

        while (slugExists) {
            const [existing] = await pool.execute(
                'SELECT id FROM noticia WHERE slug = ?',
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
            INSERT INTO noticia (
                titulo, slug, extracto, contenido, imagen, 
                autor_id, categoria_id, video_id, video_titulo, 
                video_descripcion, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            noticiaData.titulo,
            slug,
            noticiaData.extracto,
            noticiaData.contenido,
            noticiaData.imagen,
            autor_id,
            noticiaData.categoria_id,
            noticiaData.video_id || null,
            noticiaData.video_titulo || null,
            noticiaData.video_descripcion || null,
            'borrador'
        ]);

        res.status(201).json({
            id: (result as any).insertId,
            ...noticiaData,
            slug,
            autor_id,
            estado: 'borrador'
        });
    } catch (error) {
        console.error('Error al crear noticia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateNoticia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates: UpdateNoticiaDTO = req.body;

        let query = 'UPDATE noticia SET ';
        const values: any[] = [];
        const updateFields: string[] = [];

        // Mapear todos los campos posibles
        const fields: Record<string, any> = {
            titulo: updates.titulo,
            extracto: updates.extracto,
            contenido: updates.contenido,
            imagen: updates.imagen,
            categoria_id: updates.categoria_id,
            estado: updates.estado,
            video_id: updates.video_id,
            video_titulo: updates.video_titulo,
            video_descripcion: updates.video_descripcion
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

        res.json({ message: 'Noticia actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteNoticia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM noticia WHERE id = ?', [id]);
        res.json({ message: 'Noticia eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const cambiarEstadoNoticia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['borrador', 'publicado', 'archivado'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        await pool.execute(
            'UPDATE noticia SET estado = ? WHERE id = ?',
            [estado, id]
        );

        return res.json({ message: 'Estado de noticia actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar estado de noticia:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}; 