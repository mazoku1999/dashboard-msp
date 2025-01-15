import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PlusCircle, Pencil, Trash2, Mail, User as UserIcon, Power, PowerOff } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useToast } from "@/components/ui/use-toast";
import UsuarioService, { type Usuario } from "@/services/usuario.service";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/modal";
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
import { useAuth } from "@/contexts/AuthContext";

export default function UsersPage() {
    const [users, setUsers] = useState<Usuario[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Usuario | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const initialFormData: Usuario = {
        id: 0,
        nombre: '',
        correo: '',
        rol_id: 2,
        estado: 'activo',
        ultimo_acceso: undefined
    };
    const { toast } = useToast();
    const usuarioService = UsuarioService;
    const { user: currentUser } = useAuth();
    const isAdmin = currentUser?.rol_id === 1;

    const loadUsers = async () => {
        try {
            const data = await usuarioService.getUsuarios();
            // Mostrar todos los usuarios sin filtrar
            setUsers(data);
            setLoading(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los usuarios"
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = (id: number) => {
        setUserToDelete(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await usuarioService.cambiarEstado(userToDelete, 'inactivo');
                toast({
                    title: "Usuario eliminado",
                    description: "El usuario ha sido eliminado exitosamente",
                    duration: 3000,
                });
                loadUsers();
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo eliminar el usuario",
                    duration: 3000,
                });
            }
        }
        setIsDeleteOpen(false);
        setUserToDelete(null);
    };

    const handleEdit = (user: Usuario) => {
        setFormData(user);
        setFormMode('edit');
        setIsOpen(true);
    };

    const handleCreate = () => {
        setFormData(initialFormData);
        setFormMode('create');
        setIsOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData) return;

        try {
            if (formMode === 'create') {
                await usuarioService.createUsuario({
                    nombre: formData.nombre,
                    correo: formData.correo,
                    rol_id: formData.rol_id,
                    contrasena: '123456' // Contraseña temporal
                });
                toast({
                    title: "Usuario creado",
                    description: "El usuario ha sido creado exitosamente con la contraseña temporal: 123456",
                    duration: 3000,
                });
            } else {
                await usuarioService.updateUsuario(formData.id, {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    rol_id: formData.rol_id
                });
                toast({
                    title: "Usuario actualizado",
                    description: "El usuario ha sido actualizado exitosamente",
                    duration: 3000,
                });
            }

            loadUsers();
            setIsOpen(false);
            setFormData(null);
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `No se pudo ${formMode === 'create' ? 'crear' : 'actualizar'} el usuario`,
                duration: 3000,
            });
        }
    };

    const handleToggleStatus = async (user: Usuario) => {
        try {
            const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
            await usuarioService.cambiarEstado(user.id, newStatus);
            toast({
                title: "Estado actualizado",
                description: `Usuario ${newStatus === 'activo' ? 'habilitado' : 'deshabilitado'} exitosamente`,
                duration: 3000,
            });
            loadUsers();
        } catch (error) {
            console.error('Error al cambiar el estado del usuario:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cambiar el estado del usuario",
                duration: 3000,
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el usuario
                            y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>
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

            <Dialog open={isOpen} onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    setFormData(null);
                    setFormMode('create');
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {formMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={formData?.nombre ?? ''}
                                onChange={(e) => setFormData(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                                placeholder="Nombre completo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData?.correo ?? ''}
                                onChange={(e) => setFormData(prev => prev ? { ...prev, correo: e.target.value } : null)}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select
                                value={formData?.rol_id?.toString()}
                                onValueChange={(value) => setFormData(prev => prev ? { ...prev, rol_id: parseInt(value) } : null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Administrador</SelectItem>
                                    <SelectItem value="2">Editor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false);
                                setFormData(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit}>
                            {formMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="w-full max-w-[1400px] mx-auto px-4 py-6 space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
                            <p className="text-sm text-muted-foreground">
                                Gestiona los usuarios.
                            </p>
                        </div>
                        <RainbowButton
                            onClick={handleCreate}
                            className="w-full sm:w-auto gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Agregar Nuevo
                        </RainbowButton>
                    </div>

                    <div className="flex items-center">
                        <Input
                            placeholder="Buscar por nombre..."
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
                                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">USUARIO</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">EMAIL</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">ROL</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">ESTADO</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">ÚLTIMO ACCESO</th>
                                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">Cargando usuarios...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-muted-foreground">
                                        No hay usuarios que mostrar
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <UserIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="font-medium overflow-hidden text-ellipsis">{user.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="overflow-hidden text-ellipsis">{user.correo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.rol_id === 1
                                                ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                                : "bg-violet-500/10 text-violet-700 dark:text-violet-400"
                                                }`}>
                                                {user.rol_id === 1 ? "Administrador" : "Editor"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.estado === 'activo'
                                                ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
                                                : "bg-destructive/10 text-destructive dark:bg-destructive/20"
                                                }`}>
                                                {user.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleDateString() : 'Nunca'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(user)}
                                                    className="h-7 w-7 hover:border hover:border-primary hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                {isAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={`h-7 w-7 ${user.estado === 'activo'
                                                            ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            : "text-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10"
                                                            }`}
                                                        title={user.estado === 'activo' ? "Deshabilitar usuario" : "Habilitar usuario"}
                                                    >
                                                        {user.estado === 'activo' ? (
                                                            <PowerOff className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Power className="h-3.5 w-3.5" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
} 