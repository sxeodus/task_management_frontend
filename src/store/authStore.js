import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize store with stored data
      initializeAuth: () => {
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getStoredUser();
        const token = authService.getStoredToken();
        
        set({
          isAuthenticated,
          user,
          token,
        });
      },

      // Login user
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.login(credentials);
          
          if (result.success) {
            set({
              user: result.data.user,
              token: result.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            toast.success('Login successful!');
            return { success: true };
          } else {
            set({ 
              error: result.message, 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null,
            });
            
            toast.error(result.message);
            return { success: false, message: result.message, errors: result.errors };
          }
        } catch (error) {
          const message = 'An unexpected error occurred during login';
          set({ 
            error: message, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          
          toast.error(message);
          return { success: false, message };
        }
      },

      // Register user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.register(userData);
          
          if (result.success) {
            set({
              user: result.data.user,
              token: result.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            toast.success('Registration successful! Welcome!');
            return { success: true };
          } else {
            set({ 
              error: result.message, 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null,
            });
            
            toast.error(result.message);
            return { success: false, message: result.message, errors: result.errors };
          }
        } catch (error) {
          const message = 'An unexpected error occurred during registration';
          set({ 
            error: message, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          
          toast.error(message);
          return { success: false, message };
        }
      },

      // Logout user
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
        } catch (error) {
          // Use the error variable
          console.error('Logout error:', error.message || error);
          set({ error: error.message || 'Logout error' });
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          toast.success('Logged out successfully');
        }
      },

      // Get current user (refresh user data)
      getCurrentUser: async () => {
        set({ isLoading: true });
        
        try {
          const result = await authService.getCurrentUser();
          
          if (result.success) {
            set({
              user: result.data,
              isLoading: false,
            });
          } else {
            // If getting user fails, logout
            get().logout();
          }
        } catch (error) {
          // Use the error variable
          console.error('Get current user error:', error.message || error);
          set({ error: error.message || 'Get current user error' });
          get().logout();
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;