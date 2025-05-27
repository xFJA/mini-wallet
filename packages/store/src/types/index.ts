/* eslint-disable no-unused-vars */
import type { Transaction } from '@mini-wallet/types';

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
  fetchTransactions(): Promise<void>;
  addTransaction(transaction: Transaction): void;
  resetTransactionsError(): void;
};

export type WalletStore = BalanceState &
  WithdrawalState &
  TransactionState &
  BalanceActions &
  WithdrawalActions &
  TransactionActions;
/* eslint-enable no-unused-vars */
