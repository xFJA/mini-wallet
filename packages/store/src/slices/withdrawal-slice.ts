import type { Transaction, WithdrawalRequest, WithdrawalResponse } from '@mini-wallet/types';
import type { StateCreator } from 'zustand';
import type { WalletStore, WithdrawalState } from '../types';
import { getAuthHeaders } from '../utils/auth';

export const createWithdrawalSlice: StateCreator<
  WalletStore,
  [],
  [],
  WithdrawalState & {
    // eslint-disable-next-line no-unused-vars
    withdraw: (withdrawAmount: number) => Promise<WithdrawalResponse>;
    resetWithdrawalError: () => void;
  }
> = (set, get) => ({
  withdrawalIsLoading: false,
  withdrawalError: null,

  withdraw: async (withdrawAmount: number): Promise<WithdrawalResponse> => {
    set({ withdrawalIsLoading: true, withdrawalError: null });

    const balance = get().balance;
    if (withdrawAmount > balance) {
      set({ withdrawalError: 'Not enough funds', withdrawalIsLoading: false });
      throw new Error('Not enough funds');
    }

    try {
      const withdrawalRequest: WithdrawalRequest = { amount: withdrawAmount };

      const pendingTransaction: Transaction = {
        id: '-',
        amount: withdrawAmount,
        date: new Date().toISOString(),
        status: 'pending' as const,
      };

      // Add the pending transaction to the store
      get().addTransaction(pendingTransaction);

      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(withdrawalRequest),
      });

      let data: WithdrawalResponse;
      try {
        data = (await response.json()) as WithdrawalResponse;
      } catch (jsonError) {
        // eslint-disable-next-line no-console
        console.error('Error parsing JSON response:', jsonError);
        set({
          withdrawalError: 'Server returned invalid data. Please try again.',
          withdrawalIsLoading: false,
        });
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok || !data.success) {
        const errorMessage = data.message || 'Withdrawal failed';
        set({
          withdrawalError: errorMessage,
          withdrawalIsLoading: false,
        });
        throw new Error(errorMessage);
      }

      set({ withdrawalIsLoading: false });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      set({ withdrawalError: errorMessage, withdrawalIsLoading: false });
      throw err;
    }
  },

  resetWithdrawalError: () => {
    set({ withdrawalError: null });
  },
});
