import { useState, useCallback, Suspense, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import VideoService, { type Video } from "@/services/video.service";
import { useToast } from "@/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Componente de carga con skeleton
const VideoCardSkeleton = () => (
    <div className="animate-pulse">
        <div className="rounded-lg overflow-hidden flex h-[180px]">
            <div className="w-[320px] bg-muted"></div>
            <div className="flex-1 p-4 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
            </div>
        </div>
    </div>
);

// Componente de tarjeta de video optimizado
const VideoCard = memo(({ item, onEdit, onArchive }: {
    item: Video;
    onEdit: (id: number) => void;
    onArchive: (id: number) => void;
}) => {
    const handleEdit = () => onEdit(item.id);
    const handleArchive = () => onArchive(item.id);

    return (
        <Suspense fallback={<VideoCardSkeleton />}>
            <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-2 hover:shadow-xl will-change-transform flex flex-col border hover:border-2 hover:border-primary h-[360px]">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0">
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Badge className="absolute top-4 left-4 z-10">
                        {item.category}
                    </Badge>
                </div>

                <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                    <div className="mt-auto pt-3 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center text-sm font-semibold">
                                    {item.author[0]}
                                </div>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{item.author}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleEdit}
                                className="h-8 w-8 hover:border hover:border-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleArchive}
                                className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </Suspense>
    );
});

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [videoToArchive, setVideoToArchive] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const videoService = VideoService;

    const loadVideos = async () => {
        try {
            const data = await videoService.getVideos();
            setVideos(data.filter(video =>
                video.status === 'publicado' || video.status === 'borrador'
            ));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los videos"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/videos/edit/${id}`);
    };

    const handleArchive = (id: number) => {
        setVideoToArchive(id);
        setIsArchiveOpen(true);
    };

    const confirmArchive = async () => {
        if (videoToArchive) {
            try {
                await videoService.cambiarEstado(videoToArchive, 'archivado');
                toast({
                    title: "Video eliminado",
                    description: "El video ha sido eliminado exitosamente",
                    duration: 3000,
                });
                loadVideos();
            } catch (error) {
                console.error('Error al archivar el video:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo eliminar el video",
                    duration: 3000,
                });
            }
        }
        setIsArchiveOpen(false);
        setVideoToArchive(null);
    };

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar video?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro que deseas eliminar este video? Esta acción ocultará el video del portal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setVideoToArchive(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmArchive}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="w-full max-w-[1400px] mx-auto px-4 py-6 space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
                            <p className="text-sm text-muted-foreground">
                                Gestiona los videos de YouTube.
                            </p>
                        </div>
                        <RainbowButton
                            onClick={() => navigate('/videos/new')}
                            className="w-full sm:w-auto gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Agregar Video
                        </RainbowButton>
                    </div>

                    <div className="flex items-center">
                        <Input
                            placeholder="Buscar por título o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </div>

                <div className="grid gap-6 p-[20px] -m-[20px]"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                        contain: 'content'
                    }}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <VideoCardSkeleton key={index} />
                        ))
                    ) : filteredVideos.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No hay videos que mostrar
                        </div>
                    ) : (
                        filteredVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                item={video}
                                onEdit={handleEdit}
                                onArchive={handleArchive}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
} 