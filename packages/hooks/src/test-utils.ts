import { waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

export const mockUseBalance = vi.fn();
export const mockUseTransactions = vi.fn();
export const mockUseWithdrawal = vi.fn();
export const mockUseAccountData = vi.fn();
export const mockFormatCurrency = vi.fn();

beforeEach(() => {
  vi.mock('@mini-wallet/store', () => ({
    useBalance: () => mockUseBalance(),
    useTransactions: () => mockUseTransactions(),
    useWithdrawal: () => mockUseWithdrawal(),
    useAccountData: () => mockUseAccountData(),
  }));

  vi.mock('@mini-wallet/utils', () => ({
    formatCurrency: (amount: number) => mockFormatCurrency(amount),
  }));

  mockFormatCurrency.mockImplementation((amount) => `$${amount.toFixed(2)}`);
});

export const waitForHookToUpdate = async () => {
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));
};

export const resetAllMocks = () => {
  mockUseBalance.mockReset();
  mockUseTransactions.mockReset();
  mockUseWithdrawal.mockReset();
  mockUseAccountData.mockReset();
  mockFormatCurrency.mockReset();
  vi.clearAllMocks();
};
