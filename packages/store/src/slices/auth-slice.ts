/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { StateCreator } from 'zustand';
import type { AuthState, WalletStore } from '../types';

// Simplified auth types
export interface User {
  id: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      // @ts-ignore - window may not be available in all environments
      if (typeof window !== 'undefined') {
        // @ts-ignore - window may not be available in all environments
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Silently fail in non-browser environments
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      // @ts-ignore - window may not be available in all environments
      if (typeof window !== 'undefined') {
        // @ts-ignore - window may not be available in all environments
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      // Silently fail in non-browser environments
    }
  },
  removeItem: (key: string): void => {
    try {
      // @ts-ignore - window may not be available in all environments
      if (typeof window !== 'undefined') {
        // @ts-ignore - window may not be available in all environments
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Silently fail in non-browser environments
    }
  },
};

export const createAuthSlice: StateCreator<
  WalletStore,
  [],
  [],
  AuthState & {
    // eslint-disable-next-line no-unused-vars
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => boolean;
  }
> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication: in a real app, this would be an API call
      if (credentials.username === 'user' && credentials.password === 'password') {
        const user: User = {
          id: '1',
          username: credentials.username,
        };

        // Store user in localStorage for persistence
        safeLocalStorage.setItem('mini-wallet-user', JSON.stringify(user));

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: new Error('Invalid username or password'),
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error('Login failed'),
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    safeLocalStorage.removeItem('mini-wallet-user');

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const storedUser = safeLocalStorage.getItem('mini-wallet-user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        set({
          user,
          isAuthenticated: true,
        });
        return true;
      } catch (error) {
        safeLocalStorage.removeItem('mini-wallet-user');
      }
    }

    return get().isAuthenticated;
  },
});
