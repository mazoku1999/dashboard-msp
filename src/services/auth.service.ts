import { API_URL, AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/config/constants';
import { BaseService } from './base.service';

export interface AuthUser {
    id: number;
    nombre: string;
    correo: string;
    rol_id: number;
}

export interface LoginCredentials {
    correo: string;
    contrasena: string;
}

export interface AuthResponse {
    token: string;
    usuario: AuthUser;
}

class AuthService extends BaseService {
    private static instance: AuthService;
    private currentUser: AuthUser | null = null;

    private constructor() {
        super('/auth');
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const { data } = await this.axiosInstance.post<AuthResponse>('/login', credentials);
            this.setToken(data.token);
            this.setCurrentUser(data.usuario);
            return data;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    async verificarToken(): Promise<{ usuario: AuthUser }> {
        try {
            const { data } = await this.axiosInstance.get<{ usuario: AuthUser }>('/verify');
            this.setCurrentUser(data.usuario);
            return data;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout(): void {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        delete this.axiosInstance.defaults.headers.common['Authorization'];
    }

    isAuthenticated(): boolean {
        return Boolean(this.getToken()) && localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }

    setToken(token: string): void {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    getCurrentUser(): AuthUser | null {
        if (!this.currentUser) {
            const userJson = localStorage.getItem('currentUser');
            if (userJson) {
                this.currentUser = JSON.parse(userJson);
            }
        }
        return this.currentUser;
    }

    private setCurrentUser(user: AuthUser): void {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

export default AuthService.getInstance();