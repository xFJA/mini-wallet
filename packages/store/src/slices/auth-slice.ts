/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  LoginCredentials,
  LoginResponse,
  User,
  validateLoginResponse,
  validateUser,
} from '@mini-wallet/types';
import type { StateCreator } from 'zustand';
import type { AuthState, WalletStore } from '../types';

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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        try {
          const data = await response.json();

          validateLoginResponse(data);

          // TODO: Store in other places to avoid security issues
          const loginResponse = data as LoginResponse;
          safeLocalStorage.setItem('mini-wallet-token', loginResponse.token);

          const storedUser = safeLocalStorage.getItem('mini-wallet-user');
          let user: User;

          if (storedUser) {
            user = validateUser(JSON.parse(storedUser));
          } else {
            user = validateUser({
              email: credentials.email,
            });
          }

          safeLocalStorage.setItem('mini-wallet-user', JSON.stringify(user));

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Invalid response format'),
            isLoading: false,
          });
          return false;
        }
      } else {
        set({
          error: new Error('Invalid email or password'),
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
    safeLocalStorage.removeItem('mini-wallet-token');

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
