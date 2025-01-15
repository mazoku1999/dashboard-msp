import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarkdownEditor from "@/components/ui/markdown-editor";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useToast } from "@/components/ui/use-toast";
import NoticiaService, { type Noticia, type CreateNoticiaDTO, type UpdateNoticiaDTO } from '@/services/noticia.service';
import { CategoriaService, type Categoria } from '@/services/categoria.service';
import { useAuth } from "@/contexts/AuthContext";

interface VideoInfo {
    id: string;
    title: string;
    description?: string;
}

interface FormData {
    titulo: string;
    extracto: string;
    contenido: string;
    imagen: string;
    categoria_id: number;
    video_id?: string;
    video_titulo?: string;
    video_descripcion?: string;
}

export default function NewsEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [formData, setFormData] = useState<FormData>({
        titulo: "",
        extracto: "",
        contenido: "",
        imagen: "",
        categoria_id: 0
    });
    const [videoData, setVideoData] = useState<VideoInfo>({
        id: "",
        title: "",
        description: ""
    });

    const noticiaService = NoticiaService;
    const categoriaService = CategoriaService.getInstance();

    useEffect(() => {
        loadCategories();
    }, [id]);

    const loadCategories = async () => {
        try {
            const data = await categoriaService.getCategorias();
            setCategories(data);
            if (id) {
                loadNoticia(parseInt(id));
            }
            setLoading(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar las categorías"
            });
            setLoading(false);
        }
    };

    const loadNoticia = async (noticiaId: number) => {
        try {
            const noticia = await noticiaService.getNoticia(noticiaId);

            setFormData({
                titulo: noticia.title,
                extracto: noticia.excerpt,
                contenido: noticia.content,
                imagen: noticia.image,
                categoria_id: noticia.categoria_id
            });

            if (noticia.video) {
                setVideoData({
                    id: noticia.video.id,
                    title: noticia.video.title,
                    description: noticia.video.description
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cargar la noticia"
            });
            navigate('/news');
        }
    };

    const extractYoutubeId = (url: string) => {
        // Normalizar la URL
        const normalizedUrl = url.trim();

        // Patrones comunes de URLs de YouTube
        const patterns = [
            // Formato largo: youtube.com/watch?v=ID
            /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?v=([^#&?]{11})/,
            // Formato corto: youtu.be/ID
            /(?:https?:\/\/)?(?:www\.|m\.)?youtu\.be\/([^#&?]{11})/,
            // Formato embed: youtube.com/embed/ID
            /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([^#&?]{11})/,
            // Formato shorts: youtube.com/shorts/ID
            /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([^#&?]{11})/,
            // ID directo (11 caracteres)
            /^[a-zA-Z0-9_-]{11}$/
        ];

        for (const pattern of patterns) {
            const match = normalizedUrl.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        // Para el caso de ID directo
        if (patterns[4].test(normalizedUrl)) {
            return normalizedUrl;
        }

        return "";
    };

    const handleVideoUrlChange = (url: string) => {
        const videoId = extractYoutubeId(url);
        if (videoId) {
            setVideoData({ ...videoData, id: videoId });
        } else {
            toast({
                variant: "destructive",
                title: "URL inválida",
                description: "Por favor, ingresa una URL válida de YouTube",
            });
        }
    };

    const handleSubmit = async () => {
        try {
            // Validar campos requeridos
            if (!formData.titulo || !formData.extracto || !formData.contenido || !formData.imagen || !formData.categoria_id) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Por favor completa todos los campos requeridos"
                });
                return;
            }

            const noticiaData: CreateNoticiaDTO | UpdateNoticiaDTO = {
                ...formData,
                video_id: videoData.id || undefined,
                video_titulo: videoData.title || undefined,
                video_descripcion: videoData.description || undefined
            };

            if (id) {
                await noticiaService.updateNoticia(parseInt(id), noticiaData as UpdateNoticiaDTO);
                toast({
                    title: "Noticia actualizada",
                    description: "La noticia ha sido actualizada exitosamente."
                });
            } else {
                await noticiaService.createNoticia(noticiaData as CreateNoticiaDTO);
                toast({
                    title: "Noticia creada",
                    description: "La noticia ha sido creada exitosamente."
                });
            }
            navigate('/news');
        } catch (error: any) {
            console.error('Error al guardar noticia:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Ocurrió un error al guardar la noticia"
            });
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="w-full px-0 sm:px-4 md:container mx-auto py-6 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => navigate('/news')}
                        size="lg"
                        className="gap-2 dark:bg-white dark:text-black dark:hover:bg-white/90 bg-black text-white hover:bg-black/90"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {id ? 'Editar Noticia' : 'Nueva Noticia'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {id ? 'Modifica los detalles de la noticia' : 'Crea una nueva noticia'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-4">
                    <Label>Título</Label>
                    <Input
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Título de la noticia"
                    />
                </div>

                <div className="grid gap-4">
                    <Label>Extracto</Label>
                    <Input
                        value={formData.extracto}
                        onChange={(e) => setFormData({ ...formData, extracto: e.target.value })}
                        placeholder="Breve descripción de la noticia"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <Label>Imagen de portada</Label>
                        <Input
                            value={formData.imagen}
                            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                            placeholder="URL de la imagen"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Categoría</Label>
                        <Select
                            value={formData.categoria_id ? formData.categoria_id.toString() : ""}
                            onValueChange={(value) => setFormData({ ...formData, categoria_id: parseInt(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría para la noticia" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-4">
                    <Label>Contenido</Label>
                    <MarkdownEditor
                        content={formData.contenido}
                        onChange={(content) => setFormData({ ...formData, contenido: content })}
                        formData={{
                            title: formData.titulo,
                            category: categories.find(cat => cat.id === formData.categoria_id)?.name || '',
                            author: currentUser?.nombre || '',
                            image: formData.imagen
                        }}
                        videoData={videoData.id ? {
                            id: videoData.id,
                            title: videoData.title,
                            description: videoData.description || ''
                        } : undefined}
                    />
                </div>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Video Destacado (Opcional)</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>URL del Video de YouTube</Label>
                            <Input
                                onChange={(e) => handleVideoUrlChange(e.target.value)}
                                placeholder="Ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            />
                            {videoData.id && (
                                <div className="text-xs text-muted-foreground">
                                    ID extraído: {videoData.id}
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Título del Video</Label>
                            <Input
                                value={videoData.title}
                                onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                                placeholder="Título del video"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Descripción del Video</Label>
                            <Input
                                value={videoData.description}
                                onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                                placeholder="Descripción del video"
                            />
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                    <Button
                        onClick={() => navigate('/news')}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto gap-2 h-12"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cancelar
                    </Button>
                    <RainbowButton onClick={handleSubmit} className="w-full sm:w-auto gap-2">
                        <PlusCircle className="h-4 w-4" />
                        {id ? "Actualizar Noticia" : "Crear Noticia"}
                    </RainbowButton>
                </div>
            </div>
        </div>
    );
} 