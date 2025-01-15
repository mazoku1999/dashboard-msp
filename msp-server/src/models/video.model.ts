import { RowDataPacket } from 'mysql2';

export interface Video extends RowDataPacket {
    id: number;
    titulo: string;
    slug: string;
    youtube_id: string;
    descripcion: string;
    miniatura: string;
    autor_id: number;
    categoria_id: number;
    estado: 'borrador' | 'publicado' | 'archivado';
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export interface CreateVideoDTO {
    titulo: string;
    youtube_id: string;
    descripcion: string;
    miniatura: string;
    categoria_id: number;
}

export interface UpdateVideoDTO extends Partial<CreateVideoDTO> {
    estado?: 'borrador' | 'publicado' | 'archivado';
} 