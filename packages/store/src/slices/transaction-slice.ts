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
      transactionsLoading: true,
      transactionsError: null,
    });

    try {
      const response = await fetch('/api/transactions');

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = (await response.json()) as { transactions: Transaction[] };

      // Merge existing pending transactions with fetched transactions
      set((state) => {
        const fetchedTransactions = data.transactions || [];

        // Create a map of fetched transactions by amount for matching
        const fetchedByAmount = new Map<number, Transaction>();
        fetchedTransactions.forEach((t) => {
          // Only consider recent transactions (last 30 seconds) for matching
          const transactionTime = new Date(t.date).getTime();
          const thirtySecondsAgo = Date.now() - 30000;

          if (transactionTime > thirtySecondsAgo) {
            fetchedByAmount.set(t.amount, t);
          }
        });

        // Filter out pending transactions that have matching completed ones
        const pendingTransactions = state.transactions.filter((t) => {
          if (t.status !== 'pending') return true;

          // Check if this pending transaction has a matching completed one
          const matchingCompleted = fetchedByAmount.get(t.amount);
          if (matchingCompleted && t.status === 'pending') {
            // Found a match, don't keep this pending transaction
            return false;
          }

          // No match found, keep this pending transaction
          return true;
        });

        // Get IDs of all transactions we're keeping to avoid duplicates
        const pendingIds = new Set(pendingTransactions.map((t) => t.id));

        // Only add fetched transactions that aren't already in pending list
        const uniqueFetched = fetchedTransactions.filter((t) => !pendingIds.has(t.id));

        return {
          transactions: [...uniqueFetched, ...pendingTransactions],
          transactionsLoading: false,
        };
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching transactions:', error);
      set({
        transactionsError:
          error instanceof Error ? error : new Error('Failed to fetch transactions'),
        transactionsLoading: false,
      });
    }
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
