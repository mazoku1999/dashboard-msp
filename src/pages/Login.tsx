import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewspaperIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useLoginForm } from "@/hooks/useLoginForm";

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { formData, isLoading, handleChange, handleSubmit } = useLoginForm();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
            <div className="relative w-full max-w-lg mx-auto">
                {/* Decorative elements */}
                <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
                    <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-500 dark:from-blue-700"></div>
                    <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
                </div>

                <Card className="relative shadow-xl border-muted-foreground/20">
                    <CardHeader className="space-y-1 flex flex-col items-center">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                            <NewspaperIcon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
                        <CardDescription>
                            Ingresa a tu cuenta para continuar
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="correo">Correo electrónico</Label>
                                <Input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="nombre@ejemplo.com"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contrasena">Contraseña</Label>
                                <Input
                                    id="contrasena"
                                    name="contrasena"
                                    type="password"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <RainbowButton
                                className="w-full h-11 relative group"
                                disabled={isLoading}
                                style={{
                                    "--color-1": "217 91% 60%",
                                    "--color-2": "245 58% 51%",
                                    "--color-3": "280 87% 65%",
                                    "--color-4": "316 73% 52%",
                                    "--color-5": "201 96% 32%",
                                } as React.CSSProperties}
                            >
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full">
                                    {isLoading ? (
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    ) : (
                                        "Iniciar sesión"
                                    )}
                                </span>
                            </RainbowButton>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login; 