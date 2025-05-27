import { storage } from './storage';

const AUTH_TOKEN_KEY = 'mini-wallet-token';
const USER_DATA_KEY = 'mini-wallet-user';

export const getAuthToken = async (): Promise<string | null> => {
  return storage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = async (token: string): Promise<void> => {
  return storage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = async (): Promise<void> => {
  return storage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

import { User } from '@mini-wallet/types';

export const setUserData = async (userData: User): Promise<void> => {
  return storage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getUserData = async (): Promise<User | null> => {
  const data = await storage.getItem(USER_DATA_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error parsing user data:', e);
    }
  }
  return null;
};

export const removeUserData = async (): Promise<void> => {
  return storage.removeItem(USER_DATA_KEY);
};
