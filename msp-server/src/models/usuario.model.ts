import { RowDataPacket } from 'mysql2';

export interface Usuario extends RowDataPacket {
    id: number;
    nombre: string;
    correo: string;
    contrasena: string;
    rol_id: number;
    estado: 'activo' | 'inactivo';
    ultimo_acceso: Date | null;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

export interface CreateUsuarioDTO {
    nombre: string;
    correo: string;
    contrasena: string;
    rol_id: number;
}

export interface UpdateUsuarioDTO extends Partial<Omit<CreateUsuarioDTO, 'contrasena'>> {
    contrasena?: string;
    estado?: 'activo' | 'inactivo';
}

export interface LoginDTO {
    correo: string;
    contrasena: string;
} 