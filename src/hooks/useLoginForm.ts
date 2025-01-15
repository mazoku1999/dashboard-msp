import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthService from '@/services/auth.service';
import type { LoginCredentials } from '@/services/auth.service';
import { TOAST_DURATION } from '@/config/constants';

export const useLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<LoginCredentials>({
        correo: '',
        contrasena: ''
    });

    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await AuthService.login(formData);

            // Guardar el token
            AuthService.setToken(response.token);

            // Actualizar el contexto
            login();

            toast({
                title: "¡Bienvenido!",
                description: `Bienvenido ${response.usuario.nombre}`,
                duration: TOAST_DURATION,
            });

            navigate("/", { replace: true });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error de autenticación",
                description: error instanceof Error ? error.message : "Error en la conexión",
                duration: TOAST_DURATION,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        handleChange,
        handleSubmit
    };
}; 