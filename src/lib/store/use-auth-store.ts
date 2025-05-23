import { create } from 'zustand';
import { User, UserRole } from '@/types/user';
import { currentUser, mockUsers } from '@/lib/data/mock-users';
import { delay } from '@/lib/utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await delay(1500);
      
      // For demo, accept any non-empty password and find matching email
      if (!password) {
        throw new Error('Password is required');
      }
      
      const user = mockUsers.find(u => u.profile.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // For demo purposes, always return the current user (or first user)
      set({ 
        user: currentUser || user,
        isAuthenticated: true,
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    // Simulate API call
    await delay(500);
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },
  
  clearError: () => set({ error: null })
})); 