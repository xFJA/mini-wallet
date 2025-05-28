/* eslint-disable no-unused-vars */
import type { PaginatedTransactions, SortDirection, Transaction } from '@mini-wallet/types';
import type { StateCreator } from 'zustand';
import type { TransactionState, WalletStore } from '../types';
import { getAuthHeaders } from '../utils/auth';

export const createTransactionSlice: StateCreator<
  WalletStore,
  [],
  [],
  TransactionState & {
    fetchTransactions: (options?: {
      sortDirection?: SortDirection;
      page?: number;
      pageSize?: number;
    }) => Promise<void>;
    addTransaction: (newTransaction: Transaction) => void;
    resetTransactionsError: () => void;
  }
> = (set) => ({
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 5,
  totalItems: 0,

  fetchTransactions: async (options = {}) => {
    const { sortDirection = 'desc', page = 1, pageSize = 5 } = options;
    set({
      transactionsLoading: true,
      transactionsError: null,
    });

    try {
      const queryParams = new URLSearchParams();
      queryParams.set('sort', sortDirection);
      queryParams.set('page', page.toString());
      queryParams.set('pageSize', pageSize.toString());
      const response = await fetch(`/api/transactions?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = (await response.json()) as PaginatedTransactions;
      const { transactions: fetchedTransactions, totalPages, totalItems } = data;

      // Merge existing pending transactions with fetched transactions
      set((state) => {
        // Create a map of fetched transactions by amount for matching
        const fetchedByAmount = new Map<number, Transaction>();
        fetchedTransactions.forEach((t: Transaction) => {
          // Only consider recent transactions (last 30 seconds) for matching
          const transactionTime = new Date(t.date).getTime();
          const thirtySecondsAgo = Date.now() - 30000;

          if (transactionTime > thirtySecondsAgo) {
            fetchedByAmount.set(t.amount, t);
          }
        });

        // Filter out pending transactions that have matching completed ones
        const pendingTransactions = state.transactions.filter((t) => {
          if (t.status !== 'pending') return false; // Only keep pending transactions

          // Check if this pending transaction has a matching completed one
          const matchingCompleted = fetchedByAmount.get(t.amount);
          if (matchingCompleted && matchingCompleted.status === 'completed') {
            // Found a match, don't keep this pending transaction
            return false;
          }

          // No match found, keep this pending transaction
          return true;
        });

        // Only include pending transactions on the first page to avoid them appearing on every page
        const shouldIncludePending = page === 1;

        // Get IDs of all transactions we're keeping to avoid duplicates
        const pendingIds = new Set(pendingTransactions.map((t) => t.id));

        // Only add fetched transactions that aren't already in pending list
        const uniqueFetched = fetchedTransactions.filter((t: Transaction) => !pendingIds.has(t.id));

        // Combine transactions, but only include pending transactions on the first page
        const allTransactions = shouldIncludePending
          ? [...uniqueFetched, ...pendingTransactions]
          : [...uniqueFetched];

        // Sort by date first, then by status if dates are equal (completed transactions first)
        allTransactions.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          // If dates are different, sort by date according to sort direction
          if (dateA !== dateB) {
            // For 'asc', newer dates (higher values) should have higher indices
            // For 'desc', older dates (lower values) should have higher indices
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
          }

          // If dates are the same, prioritize completed transactions
          if (a.status === 'completed' && b.status !== 'completed') return -1;
          if (a.status !== 'completed' && b.status === 'completed') return 1;

          // If both have same status and date, use transaction ID for consistent ordering
          return a.id.localeCompare(b.id);
        });
        return {
          transactions: allTransactions,
          transactionsLoading: false,
          currentPage: page,
          totalPages,
          pageSize,
          totalItems,
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
