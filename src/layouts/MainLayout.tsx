import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    SearchIcon,
    LayoutDashboardIcon,
    NewspaperIcon,
    UsersIcon,
    TagIcon,
    MenuIcon,
    BellIcon,
    Settings2Icon,
    LogOutIcon,
    ChevronDownIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon,
    BarChart3Icon,
    Construction,
    FileQuestion,
    X,
    Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/mode-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const validRoutes = [
        '/',
        '/news',
        '/news/new',
        '/news/edit',
        '/categories',
        '/users',
        '/analytics',
        '/videos',
        '/videos/new',
        '/videos/edit'
    ];

    const isValidRoute = validRoutes.includes(location.pathname) ||
        location.pathname.startsWith('/news/edit/') ||
        location.pathname.startsWith('/videos/edit/');

    const getPageTitle = () => {
        if (!isValidRoute) return 'Página no encontrada';
        switch (location.pathname) {
            case '/news':
                return 'Noticias';
            case '/news/new':
                return 'Nueva Noticia';
            case '/categories':
                return 'Categorías';
            case '/users':
                return 'Usuarios';
            case '/analytics':
                return 'Análisis';
            case '/videos':
                return 'Videos';
            case '/videos/new':
                return 'Nuevo Video';
            default:
                if (location.pathname.startsWith('/news/edit/')) {
                    return 'Editar Noticia';
                }
                if (location.pathname.startsWith('/videos/edit/')) {
                    return 'Editar Video';
                }
                return 'Dashboard';
        }
    };

    const renderContent = () => {
        if (!isValidRoute) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileQuestion className="w-12 h-12 text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full">
                            404
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-primary">¡Oops!</h1>
                    <h2 className="text-2xl font-semibold text-muted-foreground">Página no encontrada</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    </p>
                    <Link to="/">
                        <Button variant="default" size="lg" className="mt-4">
                            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                            Volver al Dashboard
                        </Button>
                    </Link>
                </div>
            );
        }

        if (location.pathname === '/analytics') {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                        <Construction className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Apartado en Construcción</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        Estamos trabajando para traerte las mejores herramientas de análisis. ¡Vuelve pronto!
                    </p>
                </div>
            );
        }

        return <Outlet />;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 bottom-0 left-0 z-40
                ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r
                transition-[width,transform] duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-2`}>
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                                    <NewspaperIcon className="h-5 w-5 text-primary-foreground" />
                                </div>
                                {!sidebarCollapsed && (
                                    <div>
                                        <h2 className="font-semibold">MspPortal</h2>
                                        <p className="text-xs text-muted-foreground">Panel de Control</p>
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="space-y-6">
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2`}>
                                    {!sidebarCollapsed && <h3 className="text-xs font-medium">General</h3>}
                                </div>
                                <div className="space-y-1">
                                    <Link
                                        to="/"
                                        className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm ${location.pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                                    >
                                        <LayoutDashboardIcon className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
                                    </Link>
                                    <Link
                                        to="/analytics"
                                        className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm ${location.pathname === '/analytics' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                                    >
                                        <BarChart3Icon className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="ml-3">Análisis</span>}
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2`}>
                                    {!sidebarCollapsed && <h3 className="text-xs font-medium">Gestión</h3>}
                                </div>
                                <div className="space-y-1">
                                    <Link
                                        to="/news"
                                        className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm ${location.pathname === '/news' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                                    >
                                        <NewspaperIcon className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="ml-3">Noticias</span>}
                                    </Link>
                                    <Link
                                        to="/categories"
                                        className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm ${location.pathname === '/categories' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                                    >
                                        <TagIcon className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="ml-3">Categorías</span>}
                                    </Link>
                                    <Link
                                        to="/videos"
                                        className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm ${location.pathname === '/videos' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                                    >
                                        <Youtube className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="ml-3">Videos</span>}
                                    </Link>
                                    <Link
                                        to="/users"
                                        className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm ${location.pathname === '/users' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                                    >
                                        <UsersIcon className="h-4 w-4 shrink-0" />
                                        {!sidebarCollapsed && <span className="ml-3">Usuarios</span>}
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>

                    {/* User Menu at Bottom */}
                    <div className="mt-auto border-t">
                        <div className="p-2">
                            <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-accent to-accent/30 p-3">
                                <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-medium">
                                        {user?.nombre.charAt(0).toUpperCase()}
                                    </div>
                                </Avatar>
                                {!sidebarCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium truncate">
                                            {user?.nombre}
                                        </h3>
                                        <p className="text-xs text-muted-foreground/80 truncate">
                                            {user?.correo}
                                        </p>
                                    </div>
                                )}
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={logout}
                                    className="h-8 w-8 rounded-lg bg-background/50 hover:bg-destructive hover:text-destructive-foreground shadow-sm transition-all duration-200 opacity-70 group-hover:opacity-100"
                                    title="Cerrar sesión"
                                >
                                    <LogOutIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
                {/* Header */}
                <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 border-b">
                    <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden lg:flex"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            >
                                {sidebarCollapsed ? (
                                    <PanelLeftOpenIcon className="h-5 w-5" />
                                ) : (
                                    <PanelLeftCloseIcon className="h-5 w-5" />
                                )}
                            </Button>
                            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9 w-64 bg-accent" placeholder="Buscar..." />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground"
                            >
                                <BellIcon className="h-5 w-5" />
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-6 space-y-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default MainLayout; 