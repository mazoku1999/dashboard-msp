import { BaseService } from './base.service';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol_id: number;
    estado: 'activo' | 'inactivo';
    ultimo_acceso?: string;
    fecha_creacion?: string;
}

export interface CreateUsuarioDTO {
    nombre: string;
    correo: string;
    contrasena: string;
    rol_id: number;
}

export interface UpdateUsuarioDTO {
    nombre?: string;
    correo?: string;
    contrasena?: string;
    rol_id?: number;
    estado?: 'activo' | 'inactivo';
}

class UsuarioService extends BaseService {
    private static instance: UsuarioService;

    private constructor() {
        super('/usuarios');
    }

    public static getInstance(): UsuarioService {
        if (!UsuarioService.instance) {
            UsuarioService.instance = new UsuarioService();
        }
        return UsuarioService.instance;
    }

    async getUsuarios(): Promise<Usuario[]> {
        const { data } = await this.axiosInstance.get<Usuario[]>('');
        return data;
    }

    async getUsuario(id: number): Promise<Usuario> {
        const { data } = await this.axiosInstance.get<Usuario>(`/${id}`);
        return data;
    }

    async createUsuario(usuario: CreateUsuarioDTO): Promise<Usuario> {
        const { data } = await this.axiosInstance.post<Usuario>('', usuario);
        return data;
    }

    async updateUsuario(id: number, usuario: UpdateUsuarioDTO): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}`, usuario);
        return data;
    }

    async deleteUsuario(id: number): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.delete<{ message: string }>(`/${id}`);
        return data;
    }

    async cambiarEstado(id: number, estado: 'activo' | 'inactivo'): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}/estado`, { estado });
        return data;
    }
}

export default UsuarioService.getInstance();