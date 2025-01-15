import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
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
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
} 