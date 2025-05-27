/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Platform-agnostic storage interface
 * This abstraction allows us to use different storage implementations
 * for web (localStorage) and React Native (AsyncStorage)
 */
export interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Web implementation using localStorage
 */
export class WebStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
}

/**
 * Default storage implementation - uses WebStorage for now
 * In a React Native environment, this would be replaced with
 * a NativeStorage implementation using AsyncStorage
 */
export const storage = new WebStorage();
