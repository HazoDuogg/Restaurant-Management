import { create } from 'zustand'

interface NotificationState {
  message: string | null
  type: 'error' | 'success' | 'info'
  show: (msg: string, type?: 'error' | 'success' | 'info') => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: 'error',
  show: (msg, type = 'error') => set({ message: msg, type }),
  clear: () => set({ message: null }),
}))
