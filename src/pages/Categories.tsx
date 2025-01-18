import { useState, useEffect } from 'react';
import { CategoriaService, type Categoria } from '@/services/categoria.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, MoreVertical, Pencil, Trash2, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Categories = () => {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    const { toast } = useToast();
    const categoriaService = CategoriaService.getInstance();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const isAdmin = currentUser?.rol_id === 1;

    useEffect(() => {
        if (!isAdmin) {
            navigate('/dashboard');
        }
    }, [isAdmin, navigate]);

    const loadCategories = async () => {
        try {
            const data = await categoriaService.getCategorias();
            setCategories(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar las categorías"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingCategory) {
                await categoriaService.updateCategoria(editingCategory.id, formData);
                toast({
                    title: "Éxito",
                    description: "Categoría actualizada correctamente"
                });
            } else {
                await categoriaService.createCategoria(formData);
                toast({
                    title: "Éxito",
                    description: "Categoría creada correctamente"
                });
            }
            setShowDialog(false);
            loadCategories();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Ocurrió un error al procesar la solicitud"
            });
        }
    };

    const handleEdit = (category: Categoria) => {
        setEditingCategory(category);
        setFormData({
            nombre: category.name,
            descripcion: category.description
        });
        setShowDialog(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await categoriaService.deleteCategoria(id);
            toast({
                title: "Éxito",
                description: "Categoría eliminada correctamente"
            });
            loadCategories();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "No se pudo eliminar la categoría"
            });
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: 'activo' | 'inactivo') => {
        try {
            const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
            await categoriaService.updateCategoria(id, { estado: newStatus });
            toast({
                title: "Éxito",
                description: "Estado actualizado correctamente"
            });
            loadCategories();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "No se pudo actualizar el estado"
            });
        }
    };

    const handleNew = () => {
        setEditingCategory(null);
        setFormData({
            nombre: '',
            descripcion: ''
        });
        setShowDialog(true);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingCategory(null);
        setFormData({
            nombre: '',
            descripcion: ''
        });
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-6 space-y-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona las categorías para noticias y videos.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <RainbowButton onClick={() => {
                            setEditingCategory(null);
                            setFormData({
                                nombre: '',
                                descripcion: ''
                            });
                            setShowDialog(true);
                        }} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Agregar Nueva
                        </RainbowButton>
                    </div>
                </div>

                <div className="flex items-center">
                    <Input
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">NOMBRE</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">DESCRIPCIÓN</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">ESTADO</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">FECHA</th>
                            <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center">
                                    Cargando...
                                </td>
                            </tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center">
                                    No hay categorías que mostrar
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-medium">{category.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="whitespace-nowrap overflow-hidden text-ellipsis text-muted-foreground">
                                            {category.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={category.status === 'activo' ? 'default' : 'secondary'}
                                            className="cursor-pointer"
                                            onClick={() => handleToggleStatus(category.id, category.status)}
                                        >
                                            {category.status === 'activo' ? (
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                            ) : (
                                                <XCircle className="h-3 w-3 mr-1" />
                                            )}
                                            {category.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {format(new Date(category.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(category)}
                                                className="h-7 w-7"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(category.id)}
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? 'Actualiza los detalles de la categoría aquí.'
                                : 'Crea una nueva categoría llenando los siguientes campos.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder="Ej: Tecnología"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                placeholder="Describe brevemente esta categoría"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCloseDialog}
                            className="w-full h-11 py-6"
                        >
                            Cancelar
                        </Button>
                        <RainbowButton
                            onClick={handleSubmit}
                            className="w-full gap-2 h-11 py-6"
                        >
                            <PlusCircle className="h-4 w-4" />
                            {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                        </RainbowButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Categories; 