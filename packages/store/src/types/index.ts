/* eslint-disable no-unused-vars */
import type { User, LoginCredentials, SortDirection, Transaction } from '@mini-wallet/types';

export interface BalanceState {
  balance: number;
  isLoading: boolean;
  error: Error | null;
}

export interface WithdrawalState {
  withdrawalIsLoading: boolean;
  withdrawalError: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: Error | null;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
};

export interface AuthActions {
  // eslint-disable-next-line no-unused-vars
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export type BalanceActions = {
  fetchBalance(): Promise<void>;
  setBalance(newBalance: number): void;
  resetBalanceError(): void;
};

export type WithdrawalActions = {
  withdraw(amount: number): Promise<unknown>;
  resetWithdrawalError(): void;
};

export type TransactionActions = {
  fetchTransactions(sortDirection?: SortDirection): Promise<void>;
  addTransaction(transaction: Transaction): void;
  resetTransactionsError(): void;
};

export type WalletStore = BalanceState &
  WithdrawalState &
  TransactionState &
  AuthState &
  BalanceActions &
  WithdrawalActions &
  TransactionActions &
  AuthActions;
/* eslint-enable no-unused-vars */
