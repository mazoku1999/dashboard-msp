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
import { News, initialNews } from '@/data/news';

interface VideoInfo {
    id: string;
    title: string;
    description?: string;
}

export default function NewsEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState<News>({
        id: 0,
        title: "",
        excerpt: "",
        content: "",
        image: "",
        author: "",
        created_at: new Date().toISOString(),
        category: "",
    });
    const [videoData, setVideoData] = useState<VideoInfo>({
        id: "",
        title: "",
        description: ""
    });

    useEffect(() => {
        if (id) {
            // Buscar la noticia en el array de noticias
            const newsItem = initialNews.find(item => item.id === parseInt(id));
            if (newsItem) {
                setFormData(newsItem);
                if (newsItem.video) {
                    setVideoData(newsItem.video);
                }
            } else {
                // Si no se encuentra la noticia, mostrar un mensaje y redirigir
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se encontró la noticia especificada.",
                });
                navigate('/news');
            }
        }
    }, [id, navigate, toast]);

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

    const handleSubmit = () => {
        // Aquí manejarías la creación/actualización de la noticia
        // Por ahora solo mostraremos un mensaje de éxito
        if (id) {
            // Actualizar noticia existente
            const index = initialNews.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                initialNews[index] = {
                    ...formData,
                    video: videoData.id ? videoData : undefined
                };
            }
        } else {
            // Crear nueva noticia
            const newNews = {
                ...formData,
                id: initialNews.length + 1,
                created_at: new Date().toISOString(),
                slug: formData.title.toLowerCase().replace(/ /g, '-'),
                video: videoData.id ? videoData : undefined
            };
            initialNews.push(newNews);
        }

        toast({
            title: id ? "Noticia actualizada" : "Noticia creada",
            description: `La noticia ha sido ${id ? "actualizada" : "creada"} exitosamente.`,
        });
        navigate('/news');
    };

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
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Título de la noticia"
                    />
                </div>

                <div className="grid gap-4">
                    <Label>Extracto</Label>
                    <Input
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Breve descripción de la noticia"
                    />
                </div>

                <div className="grid gap-4">
                    <Label>Imagen de portada</Label>
                    <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="URL de la imagen"
                    />
                </div>

                <div className="grid gap-4">
                    <Label>Autor</Label>
                    <Input
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Nombre del autor"
                    />
                </div>

                <div className="grid gap-4">
                    <Label>Categoría</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Tecnología">Tecnología</SelectItem>
                            <SelectItem value="Ciencia">Ciencia</SelectItem>
                            <SelectItem value="Deportes">Deportes</SelectItem>
                            <SelectItem value="Cultura">Cultura</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4">
                    <Label>Contenido</Label>
                    <MarkdownEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content: content })}
                        formData={{
                            title: formData.title,
                            category: formData.category,
                            author: formData.author,
                            image: formData.image
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