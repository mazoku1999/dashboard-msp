import { BaseService } from './base.service';

export interface Noticia {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    created_at: string;
    status: 'borrador' | 'publicado' | 'archivado';
    category: string;
    video?: {
        id: string;
        title: string;
        description: string;
    };
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

export interface UpdateNoticiaDTO {
    titulo?: string;
    extracto?: string;
    contenido?: string;
    imagen?: string;
    categoria_id?: number;
    video_id?: string;
    video_titulo?: string;
    video_descripcion?: string;
    estado?: 'borrador' | 'publicado' | 'archivado';
}

class NoticiaService extends BaseService {
    private static instance: NoticiaService;

    private constructor() {
        super('/noticias');
    }

    public static getInstance(): NoticiaService {
        if (!NoticiaService.instance) {
            NoticiaService.instance = new NoticiaService();
        }
        return NoticiaService.instance;
    }

    async getNoticias(): Promise<Noticia[]> {
        const { data } = await this.axiosInstance.get<Noticia[]>('');
        return data;
    }

    async getNoticia(id: number): Promise<Noticia> {
        const { data } = await this.axiosInstance.get<Noticia>(`/${id}`);
        return data;
    }

    async getNoticiaBySlug(slug: string): Promise<Noticia> {
        const { data } = await this.axiosInstance.get<Noticia>(`/slug/${slug}`);
        return data;
    }

    async createNoticia(noticia: CreateNoticiaDTO): Promise<Noticia> {
        const { data } = await this.axiosInstance.post<Noticia>('', noticia);
        return data;
    }

    async updateNoticia(id: number, noticia: UpdateNoticiaDTO): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}`, noticia);
        return data;
    }

    async deleteNoticia(id: number): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.delete<{ message: string }>(`/${id}`);
        return data;
    }

    async cambiarEstado(id: number, estado: 'borrador' | 'publicado' | 'archivado'): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}/estado`, { estado });
        return data;
    }
}

export default NoticiaService.getInstance(); 