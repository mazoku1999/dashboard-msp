import { useState, useEffect, memo, Suspense, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Avatar } from "@/components/ui/avatar";
import { Pencil, Trash, PlusCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import NoticiaService, { type Noticia } from '@/services/noticia.service';
import { useAuth } from "@/contexts/AuthContext";

// Componente de carga con skeleton
const NewsCardSkeleton = () => (
    <div className="animate-pulse">
        <div className="rounded-lg overflow-hidden">
            <div className="h-[200px] bg-muted"></div>
            <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
                <div className="pt-4 border-t mt-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted"></div>
                        <div className="space-y-1">
                            <div className="h-3 bg-muted rounded w-24"></div>
                            <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Componente de imagen optimizado con IntersectionObserver
const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        const element = document.querySelector(`[data-image-src="${src}"]`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [src]);

    // Precarga de imagen cuando está en vista
    useEffect(() => {
        if (isInView) {
            const img = new Image();
            img.src = src;
            img.onload = () => setImageLoaded(true);
        }
    }, [isInView, src]);

    return (
        <div className="relative w-full h-full" data-image-src={src}>
            {/* Blur placeholder con color dominante */}
            <div
                className={`absolute inset-0 bg-muted/20 backdrop-blur-xl transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                style={{
                    background: `linear-gradient(to bottom right, ${getColorFromString(src)}, ${getColorFromString(alt)})`
                }}
            />
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
    );
});

// Función para generar colores basados en strings
const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Componente de tarjeta de noticia optimizado
const NewsCard = memo(({ item, onEdit, onDelete }: {
    item: Noticia;
    onEdit: (item: Noticia) => void;
    onDelete: (id: number) => void;
}) => {
    // Memoizar handlers para evitar re-renders
    const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);
    const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);

    return (
        <Suspense fallback={<NewsCardSkeleton />}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 will-change-transform hover:-translate-y-1 flex flex-col">
                <div className="relative h-[200px] overflow-hidden">
                    <OptimizedImage src={item.image} alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                        <Badge>
                            {item.category}
                        </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                        <Badge variant={item.status === 'publicado' ? 'default' : 'secondary'}>
                            {item.status === 'publicado' ? 'Publicado' : 'Borrador'}
                        </Badge>
                    </div>
                    {item.video && (
                        <div className="absolute bottom-4 right-4">
                            <Badge variant="secondary" className="bg-red-500/80 hover:bg-red-500/90 text-white gap-1.5">
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Video
                            </Badge>
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 p-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight line-clamp-2">
                            {item.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.excerpt}
                        </p>
                    </div>
                </div>
                <div className="p-6 pt-0 mt-auto">
                    <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center text-sm font-semibold">
                                    {item.author[0]}
                                </div>
                            </Avatar>
                            <div className="grid gap-0.5 text-xs">
                                <span className="font-medium">{item.author}</span>
                                <span className="text-muted-foreground">
                                    {new Date(item.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleEdit}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:border hover:border-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </Suspense>
    );
}, (prevProps, nextProps) => {
    // Optimización de re-renders
    return prevProps.item.id === nextProps.item.id &&
        prevProps.item.title === nextProps.item.title &&
        prevProps.item.image === nextProps.item.image;
});

export default function NewsPage() {
    const [news, setNews] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();
    const noticiaService = NoticiaService;
    useAuth();

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await noticiaService.getNoticias();
            setNews(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar las noticias"
            });
        } finally {
            setLoading(false);
        }
    };

    // Memoizar la lista filtrada
    const filteredNews = useMemo(() =>
        news.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [news, searchTerm]
    );

    const handleEdit = (item: Noticia) => {
        navigate(`/news/edit/${item.id}`);
    };

    const handleDelete = (id: number) => {
        setNewsToDelete(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (newsToDelete) {
            try {
                await noticiaService.deleteNoticia(newsToDelete);
                toast({
                    title: "Éxito",
                    description: "La noticia ha sido eliminada correctamente"
                });
                loadNews();
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo eliminar la noticia"
                });
            }
        }
        setIsDeleteOpen(false);
        setNewsToDelete(null);
    };

    return (
        <>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la noticia
                            y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNewsToDelete(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
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
                            <h1 className="text-3xl font-bold tracking-tight">Noticias</h1>
                            <p className="text-sm text-muted-foreground">
                                Gestiona y publica noticias en tu portal.
                            </p>
                        </div>
                        <RainbowButton onClick={() => navigate('/news/new')} className="w-full sm:w-auto gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Nueva Noticia
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

                <div className="grid auto-rows-[minmax(420px,auto)] gap-6 p-[20px] -m-[20px]"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                        contain: 'content'
                    }}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <NewsCardSkeleton key={index} />
                        ))
                    ) : filteredNews.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No hay noticias que mostrar</p>
                        </div>
                    ) : (
                        filteredNews.map((item) => (
                            <NewsCard
                                key={item.id}
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
} 