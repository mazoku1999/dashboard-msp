import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService, { type AuthUser } from '@/services/auth.service';

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
    const [user, setUser] = useState<AuthUser | null>(AuthService.getCurrentUser());
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated && location.pathname === '/login') {
            navigate('/', { replace: true });
        }
    }, [navigate, location, isAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
        setUser(AuthService.getCurrentUser());
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 