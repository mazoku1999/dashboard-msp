import { RowDataPacket } from 'mysql2';

export interface Categoria extends RowDataPacket {
    id: number;
    nombre: string;
    descripcion: string;
    estado: 'activo' | 'inactivo';
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export interface CreateCategoriaDTO {
    nombre: string;
    descripcion: string;
}

export interface UpdateCategoriaDTO extends Partial<CreateCategoriaDTO> {
    estado?: 'activo' | 'inactivo';
} 