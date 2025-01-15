import { RowDataPacket } from 'mysql2';

export interface Rol extends RowDataPacket {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_creacion: Date;
}

export interface CreateRolDTO {
    nombre: string;
    descripcion: string;
}

export interface UpdateRolDTO extends Partial<CreateRolDTO> { } 