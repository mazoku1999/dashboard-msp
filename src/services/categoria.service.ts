import { BaseService } from './base.service';

export interface Categoria {
    id: number;
    name: string;
    description: string;
    status: 'activo' | 'inactivo';
    created_at: string;
}

export interface CreateCategoriaDTO {
    nombre: string;
    descripcion: string;
}

export interface UpdateCategoriaDTO {
    nombre?: string;
    descripcion?: string;
    estado?: 'activo' | 'inactivo';
}

export class CategoriaService extends BaseService {
    private static instance: CategoriaService;

    private constructor() {
        super('/categorias');
    }

    public static getInstance(): CategoriaService {
        if (!CategoriaService.instance) {
            CategoriaService.instance = new CategoriaService();
        }
        return CategoriaService.instance;
    }

    async getCategorias(): Promise<Categoria[]> {
        const { data } = await this.axiosInstance.get<Categoria[]>('');
        return data;
    }

    async getCategoria(id: number): Promise<Categoria> {
        const { data } = await this.axiosInstance.get<Categoria>(`/${id}`);
        return data;
    }

    async createCategoria(categoria: CreateCategoriaDTO): Promise<Categoria> {
        const { data } = await this.axiosInstance.post<Categoria>('', categoria);
        return data;
    }

    async updateCategoria(id: number, categoria: UpdateCategoriaDTO): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}`, categoria);
        return data;
    }

    async deleteCategoria(id: number): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.delete<{ message: string }>(`/${id}`);
        return data;
    }

    async cambiarEstado(id: number, estado: 'activo' | 'inactivo'): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}/estado`, { estado });
        return data;
    }
}