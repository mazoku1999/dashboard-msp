import { API_URL } from '@/config/constants';
import axios, { AxiosInstance } from 'axios';
import AuthService from './auth.service';

export class BaseService {
    protected axiosInstance: AxiosInstance;
    protected baseUrl: string;

    constructor(path: string) {
        this.baseUrl = `${API_URL}${path}`;
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para agregar el token a todas las peticiones
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = AuthService.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para manejar errores de autenticación
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        AuthService.logout();
                    }
                    throw new Error(error.response?.data?.message || 'Error en la petición');
                }
                throw new Error('Error en la conexión con el servidor');
            }
        );
    }
}