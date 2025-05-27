const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      // @ts-expect-error - window may not be available in all environments
      if (typeof window !== 'undefined') {
        // @ts-expect-error - window may not be available in all environments
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Silently fail in non-browser environments
    }
    return null;
  },
};

export const getAuthToken = (): string | null => {
  return safeLocalStorage.getItem('mini-wallet-token');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
