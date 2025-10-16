import { create } from 'zustand';
import type { User } from '@shared/types';
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'github' | 'admin') => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (provider) => {
    // This is a mock login. In a real app, you'd handle OAuth flow.
    let mockUser: User;
    if (provider === 'admin') {
      mockUser = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@pazebem.com',
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Admin`,
        role: 'admin',
      };
    } else {
      mockUser = {
        id: 'user-123',
        name: provider === 'google' ? 'Paz e Bem User' : 'GitHub Coder',
        email: 'user@pazebem.com',
        avatar: `https://api.dicebear.com/8.x/lorelei/svg?seed=${provider}`,
        role: 'user',
      };
    }
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));