import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    user: { id: number, role: string, name: string } | null;
    login: (
        data: {
            accessToken: string;
            user: { id: number, role: string, name: string };
        }
    ) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: localStorage.getItem('accessToken'),
    user: (() => { try { const v = localStorage.getItem('user'); return v ? JSON.parse(v) : null; } catch { return null; } })(),
    login: ({ accessToken, user }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({ accessToken, user });
    },
    setAccessToken: (token) => {
        localStorage.setItem('accessToken', token);
        set({ accessToken: token });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        set({ accessToken: null, user: null });
    }
}));