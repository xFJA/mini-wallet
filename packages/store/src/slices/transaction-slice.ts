import type { Transaction } from '@mini-wallet/types';
import type { StateCreator } from 'zustand';
import type { TransactionState, WalletStore } from '../types';

export const createTransactionSlice: StateCreator<
  WalletStore,
  [],
  [],
  TransactionState & {
    fetchTransactions: () => Promise<void>;
    // eslint-disable-next-line no-unused-vars
    addTransaction: (newTransaction: Transaction) => void;
    resetTransactionsError: () => void;
  }
> = (set) => ({
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,

  fetchTransactions: async () => {
    set({
      transactions: [],
      transactionsLoading: false,
      transactionsError: null,
    });
    return Promise.resolve();
  },

  addTransaction: (newTransaction: Transaction) => {
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
  },

  resetTransactionsError: () => {
    set({ transactionsError: null });
  },
});
