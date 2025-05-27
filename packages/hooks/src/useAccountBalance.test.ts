import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccountBalance } from './useAccountBalance';

vi.mock('@mini-wallet/store', () => ({
  useBalance: vi.fn(),
}));

vi.mock('@mini-wallet/utils', () => ({
  formatCurrency: vi.fn((amount) => `$${amount.toFixed(2)}`),
}));

import { useBalance } from '@mini-wallet/store';
import { formatCurrency } from '@mini-wallet/utils';

describe('useAccountBalance [hook]', () => {
  const mockFetchBalance = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useBalance as any).mockReturnValue({
      balance: 1000,
      isLoading: false,
      error: null,
      fetchBalance: mockFetchBalance,
    });
  });

  it('should return the account balance and formatted balance', () => {
    const { result } = renderHook(() => useAccountBalance());

    expect(result.current.balance).toBe(1000);
    expect(result.current.formattedBalance).toBe('$1000.00');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(formatCurrency).toHaveBeenCalledWith(1000);
  });

  it('should call fetchBalance on mount', () => {
    renderHook(() => useAccountBalance());

    expect(mockFetchBalance).toHaveBeenCalledTimes(1);
  });

  it('should handle loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useBalance as any).mockReturnValue({
      balance: 0,
      isLoading: true,
      error: null,
      fetchBalance: mockFetchBalance,
    });

    const { result } = renderHook(() => useAccountBalance());

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', () => {
    const testError = new Error('Failed to fetch balance');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useBalance as any).mockReturnValue({
      balance: 0,
      isLoading: false,
      error: testError,
      fetchBalance: mockFetchBalance,
    });

    const { result } = renderHook(() => useAccountBalance());

    expect(result.current.error).toBe(testError);
  });
});
