import axios from "axios";
import { useAuthStore } from "../state/auth";

export const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        _retry?: boolean
    }
}

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
            originalRequest._retry = true;
            try {
                const res = await api.post('auth/refresh');
                const newAccessToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (error) {
                useAuthStore.getState().logout();
                if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    window.location.replace('/login');
                }
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);