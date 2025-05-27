import type { Transaction } from '@mini-wallet/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createBalanceSlice } from './slices/balance-slice';
import { createTransactionSlice } from './slices/transaction-slice';
import { createWithdrawalSlice } from './slices/withdrawal-slice';
import type { WalletStore } from './types';

export const useWalletStore = create<WalletStore>()(
  immer((set, get, api) => ({
    ...createBalanceSlice(set, get, api),
    ...createWithdrawalSlice(set, get, api),
    ...createTransactionSlice(set, get, api),
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

  const refreshAccountData = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  return {
    accountData: {
      balance,
      transactions,
    },
    isLoading: balanceLoading || transactionsLoading,
    error: balanceError || transactionsError,
    refreshAccountData,
  };
};
