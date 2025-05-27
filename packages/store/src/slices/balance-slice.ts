/* eslint-disable no-unused-vars */
import type { AccountData } from '@mini-wallet/types';
import type { StateCreator } from 'zustand';
import type { BalanceState, WalletStore } from '../types';
import { getAuthHeaders } from '../utils/auth';

export const createBalanceSlice: StateCreator<
  WalletStore,
  [],
  [],
  BalanceState & {
    fetchBalance: () => Promise<void>;
    setBalance: (newBalance: number) => void;
    resetBalanceError: () => void;
  }
> = (set) => ({
  balance: 0,
  isLoading: false,
  error: null,
  fetchBalance: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/wallet', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      let data: AccountData;
      try {
        data = (await response.json()) as AccountData;
        set({ balance: data.balance, isLoading: false });
      } catch (jsonError) {
        // eslint-disable-next-line no-console
        console.error('Error parsing balance JSON response:', jsonError);
        set({
          error: new Error('Server returned invalid data when fetching balance'),
          isLoading: false,
        });
        throw new Error('Invalid JSON response from balance endpoint');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      set({ error, isLoading: false });
    }
  },

  setBalance: (newBalance: number) => {
    set({ balance: newBalance });
  },

  resetBalanceError: () => {
    set({ error: null });
  },
});
