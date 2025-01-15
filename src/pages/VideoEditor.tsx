import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, PlusCircle, Youtube } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useToast } from "@/components/ui/use-toast";
import VideoService, { type CreateVideoDTO, type UpdateVideoDTO } from "@/services/video.service";
import { CategoriaService, type Categoria } from "@/services/categoria.service";
import { Label } from "@/components/ui/label";

// Función para extraer el ID de YouTube de una URL
const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
};

// Función para obtener información del video de YouTube usando oEmbed
const getYoutubeVideoInfo = async (videoId: string) => {
    try {
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        if (!response.ok) {
            throw new Error('No se pudo obtener la información del video');
        }

        const data = await response.json();
        return {
            title: data.title,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            youtubeId: videoId,
            author: data.author_name
        };
    } catch (error) {
        throw new Error('Error al obtener la información del video');
    }
};

interface FormData {
    titulo: string;
    youtube_id: string;
    descripcion: string;
    miniatura: string;
    categoria_id: number;
    estado?: 'borrador' | 'publicado' | 'archivado';
}

export default function VideoEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [formData, setFormData] = useState<FormData>({
        titulo: "",
        youtube_id: "",
        descripcion: "",
        miniatura: "",
        categoria_id: 0,
        estado: 'borrador'
    });

    const videoService = VideoService;
    const categoriaService = CategoriaService.getInstance();

    // Cargar categorías
    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const data = await categoriaService.getCategorias();
                setCategorias(data.filter(cat => cat.status === 'activo'));
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudieron cargar las categorías"
                });
            }
        };
        loadCategorias();
    }, []);

    // Cargar video si estamos en modo edición
    useEffect(() => {
        const loadVideo = async () => {
            if (id) {
                try {
                    const video = await videoService.getVideo(parseInt(id));
                    setFormData({
                        titulo: video.title,
                        youtube_id: video.youtubeId,
                        descripcion: video.description,
                        miniatura: video.thumbnail,
                        categoria_id: categorias.find(c => c.name === video.category)?.id || 0,
                        estado: video.status
                    });
                    setYoutubeUrl(`https://youtube.com/watch?v=${video.youtubeId}`);
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "No se pudo cargar el video"
                    });
                    navigate('/videos');
                }
            }
        };
        if (categorias.length > 0) {
            loadVideo();
        }
    }, [id, categorias]);

    const handleYoutubeUrlChange = async (url: string) => {
        setYoutubeUrl(url);
        setError("");

        const videoId = getYoutubeVideoId(url);
        if (!videoId) {
            setError("URL de YouTube inválida");
            return;
        }

        setIsLoading(true);
        try {
            const videoInfo = await getYoutubeVideoInfo(videoId);
            setFormData(prev => ({
                ...prev,
                titulo: videoInfo.title || prev.titulo,
                youtube_id: videoInfo.youtubeId,
                miniatura: videoInfo.thumbnail,
                descripcion: prev.descripcion || `Video de ${videoInfo.author}`
            }));
        } catch (err) {
            setError("Error al obtener la información del video");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            categoria_id: parseInt(value)
        }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            estado: value as 'borrador' | 'publicado' | 'archivado'
        }));
    };

    const handleSubmit = async () => {
        if (!formData.titulo || !formData.youtube_id || !formData.categoria_id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor completa todos los campos requeridos.",
            });
            return;
        }

        try {
            if (id) {
                const updateData: UpdateVideoDTO = {
                    titulo: formData.titulo,
                    youtube_id: formData.youtube_id,
                    descripcion: formData.descripcion,
                    miniatura: formData.miniatura,
                    categoria_id: formData.categoria_id,
                    estado: formData.estado
                };
                await videoService.updateVideo(parseInt(id), updateData);
            } else {
                const createData: CreateVideoDTO = {
                    titulo: formData.titulo,
                    youtube_id: formData.youtube_id,
                    descripcion: formData.descripcion,
                    miniatura: formData.miniatura,
                    categoria_id: formData.categoria_id
                };
                await videoService.createVideo(createData);
            }

            toast({
                title: id ? "Video actualizado" : "Video creado",
                description: `El video ha sido ${id ? "actualizado" : "creado"} exitosamente.`,
            });
            navigate('/videos');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || `No se pudo ${id ? "actualizar" : "crear"} el video.`
            });
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                    onClick={() => navigate('/videos')}
                    size="lg"
                    className="w-full sm:w-auto gap-2 dark:bg-white dark:text-black dark:hover:bg-white/90 bg-black text-white hover:bg-black/90"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {id ? 'Editar Video' : 'Nuevo Video'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {id ? 'Modifica los detalles del video' : 'Agrega un nuevo video'}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-16">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL de YouTube</label>
                        <Input
                            placeholder="https://youtube.com/watch?v=..."
                            value={youtubeUrl}
                            onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                            className={error ? "border-destructive" : ""}
                        />
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Título</label>
                        <Input
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleInputChange}
                            placeholder="Título del video"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Categoría</label>
                        <Select
                            value={formData.categoria_id.toString()}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categorias.map((categoria) => (
                                    <SelectItem
                                        key={categoria.id}
                                        value={categoria.id.toString()}
                                    >
                                        {categoria.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {id && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <Select
                                value={formData.estado}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="borrador">Borrador</SelectItem>
                                    <SelectItem value="publicado">Publicado</SelectItem>
                                    <SelectItem value="archivado">Archivado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">Vista previa</label>
                    {formData.youtube_id ? (
                        <div>
                            <div className="relative rounded-lg overflow-hidden">
                                <div style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${formData.youtube_id}`}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px] rounded-lg border-2 border-dashed">
                            <div className="text-center space-y-2">
                                <Youtube className="w-12 h-12 mx-auto text-muted-foreground" />
                                <h3 className="font-medium">Ingresa la URL de un video</h3>
                                <p className="text-sm text-muted-foreground">
                                    La vista previa aparecerá aquí
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-16 pt-6 border-t">
                <Button
                    onClick={() => navigate('/videos')}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    Cancelar
                </Button>
                <RainbowButton
                    onClick={handleSubmit}
                    className="w-full sm:w-auto gap-2"
                    disabled={!formData.titulo || !formData.youtube_id || !formData.categoria_id}
                >
                    <PlusCircle className="h-4 w-4" />
                    {id ? "Actualizar Video" : "Crear Video"}
                </RainbowButton>
            </div>
        </div>
    );
} 