import type { Transaction } from '@mini-wallet/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice } from './slices/auth-slice';
import { createBalanceSlice } from './slices/balance-slice';
import { createTransactionSlice } from './slices/transaction-slice';
import { createWithdrawalSlice } from './slices/withdrawal-slice';
import type { WalletStore } from './types';

export const useWalletStore = create<WalletStore>()(
  immer((set, get, api) => ({
    ...createBalanceSlice(set, get, api),
    ...createWithdrawalSlice(set, get, api),
    ...createTransactionSlice(set, get, api),
    ...createAuthSlice(set, get, api),
  }))
);

export const useBalance = () => {
  return useWalletStore((state) => ({
    balance: state.balance,
    isLoading: state.isLoading,
    error: state.error,
    fetchBalance: state.fetchBalance,
    setBalance: state.setBalance,
  }));
};

export const useWithdrawal = () => {
  return useWalletStore((state) => ({
    withdraw: state.withdraw,
    isLoading: state.withdrawalIsLoading,
    error: state.withdrawalError,
    resetError: state.resetWithdrawalError,
  }));
};

export const useTransactions = () => {
  return useWalletStore((state) => ({
    transactions: state.transactions as Transaction[],
    isLoading: state.transactionsLoading,
    error: state.transactionsError,
    fetchTransactions: state.fetchTransactions,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    pageSize: state.pageSize,
    totalItems: state.totalItems,
  }));
};

export const useAuth = () => {
  return useWalletStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    logout: state.logout,
    checkAuth: state.checkAuth,
  }));
};

export const useAccountData = () => {
  const { balance, isLoading: balanceLoading, error: balanceError, fetchBalance } = useBalance();

  const {
    transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    fetchTransactions,
  } = useTransactions();

  const isLoading = balanceLoading || transactionsLoading;
  const error = balanceError || transactionsError;

  const fetchAccountData = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  return {
    balance,
    transactions,
    isLoading,
    error,
    fetchAccountData,
  };
};
