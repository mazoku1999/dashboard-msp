import { BaseService } from './base.service';

export interface Video {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    youtubeId: string;
    description: string;
    author: string;
    created_at: string;
    status: 'borrador' | 'publicado' | 'archivado';
    category: string;
}

export interface CreateVideoDTO {
    titulo: string;
    youtube_id: string;
    descripcion: string;
    miniatura: string;
    categoria_id: number;
    estado?: 'borrador' | 'publicado';
}

export interface UpdateVideoDTO {
    titulo?: string;
    youtube_id?: string;
    descripcion?: string;
    miniatura?: string;
    categoria_id?: number;
    estado?: 'borrador' | 'publicado' | 'archivado';
}

class VideoService extends BaseService {
    private static instance: VideoService;

    private constructor() {
        super('/videos');
    }

    public static getInstance(): VideoService {
        if (!VideoService.instance) {
            VideoService.instance = new VideoService();
        }
        return VideoService.instance;
    }

    async getVideos(): Promise<Video[]> {
        const { data } = await this.axiosInstance.get<Video[]>('');
        return data;
    }

    async getVideo(id: number): Promise<Video> {
        const { data } = await this.axiosInstance.get<Video>(`/${id}`);
        return data;
    }

    async getVideoBySlug(slug: string): Promise<Video> {
        const { data } = await this.axiosInstance.get<Video>(`/slug/${slug}`);
        return data;
    }

    async createVideo(video: CreateVideoDTO): Promise<Video> {
        const { data } = await this.axiosInstance.post<Video>('', video);
        return data;
    }

    async updateVideo(id: number, video: UpdateVideoDTO): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}`, video);
        return data;
    }

    async deleteVideo(id: number): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.delete<{ message: string }>(`/${id}`);
        return data;
    }

    async cambiarEstado(id: number, estado: 'borrador' | 'publicado' | 'archivado'): Promise<{ message: string }> {
        const { data } = await this.axiosInstance.put<{ message: string }>(`/${id}/estado`, { estado });
        return data;
    }
}

export default VideoService.getInstance();