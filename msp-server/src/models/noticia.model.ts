import { RowDataPacket } from 'mysql2';

export interface Noticia extends RowDataPacket {
    id: number;
    titulo: string;
    slug: string;
    extracto: string;
    contenido: string;
    imagen: string;
    autor_id: number;
    categoria_id: number;
    estado: 'borrador' | 'publicado' | 'archivado';
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    video_id: string | null;
    video_titulo: string | null;
    video_descripcion: string | null;
}

export interface CreateNoticiaDTO {
    titulo: string;
    extracto: string;
    contenido: string;
    imagen: string;
    categoria_id: number;
    video_id?: string;
    video_titulo?: string;
    video_descripcion?: string;
}

export interface UpdateNoticiaDTO extends Partial<CreateNoticiaDTO> {
    estado?: 'borrador' | 'publicado' | 'archivado';
    slug?: string;
} 