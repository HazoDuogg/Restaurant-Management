import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    user: { id: number, role: string, name: string } | null;
    login: (
        data: {
            accessToken: string;
            user: { id: number, role: string, name: string };
        },
        remember: boolean
    ) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken'),
    user: (() => {
        try {
            const v = localStorage.getItem('user') ?? sessionStorage.getItem('user');
            return v ? JSON.parse(v) : null;
        } catch { return null; }
    })(),
    login: ({ accessToken, user }, remember) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('accessToken', accessToken);
        storage.setItem('user', JSON.stringify(user));
        set({ accessToken, user });
    },
    setAccessToken: (token) => {
        const storage = localStorage.getItem('accessToken') !== null ? localStorage : sessionStorage;
        storage.setItem('accessToken', token);
        set({ accessToken: token });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('user');
        set({ accessToken: null, user: null });
    }
}));