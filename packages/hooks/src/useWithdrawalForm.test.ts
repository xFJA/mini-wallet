import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWithdrawalForm } from './useWithdrawalForm';

vi.mock('@mini-wallet/store', () => ({
  useWithdrawal: vi.fn(),
  useAccountData: vi.fn(),
  useTransactions: vi.fn(),
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: <T extends Record<string, unknown>>(callback: (data: T) => void) => {
      // This simulates how react-hook-form's handleSubmit works
      // It accepts an event-like object or direct data and extracts the data for the callback
      return (event: React.BaseSyntheticEvent | T) => {
        // If it's an event (has preventDefault), extract data from it
        // Otherwise assume it's already the data object
        const data = 'preventDefault' in event ? ({ amount: '100' } as unknown as T) : (event as T);

        return callback(data);
      };
    },
    reset: vi.fn(),
    formState: { errors: {} },
  }),
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(),
}));

import { useAccountData, useTransactions, useWithdrawal } from '@mini-wallet/store';

describe('useWithdrawalForm [hook]', () => {
  const withdrawMock = vi.fn();
  const fetchAccountDataMock = vi.fn();
  const fetchTransactionsMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    withdrawMock.mockResolvedValue(undefined);
    fetchAccountDataMock.mockResolvedValue(undefined);
    fetchTransactionsMock.mockResolvedValue(undefined);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useWithdrawal as any).mockReturnValue({
      withdraw: withdrawMock,
      isLoading: false,
      error: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAccountData as any).mockReturnValue({
      fetchAccountData: fetchAccountDataMock,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useTransactions as any).mockReturnValue({
      fetchTransactions: fetchTransactionsMock,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should handle successful withdrawal submission', async () => {
    const { result } = renderHook(() => useWithdrawalForm({ onSuccess: onSuccessMock }));

    await act(async () => {
      await result.current.handleSubmit({ amount: '100' });
    });

    expect(withdrawMock).toHaveBeenCalledWith(100);

    expect(result.current.successMessage).toBe('Withdrawal successful!');

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetchAccountDataMock).toHaveBeenCalled();
    expect(fetchTransactionsMock).toHaveBeenCalled();

    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should handle withdrawal error', async () => {
    const testError = new Error('Withdrawal failed');
    withdrawMock.mockRejectedValue(testError);

    const { result } = renderHook(() => useWithdrawalForm());

    await act(async () => {
      await result.current.handleSubmit({ amount: '100' });
    });

    expect(result.current.error).toBe('An error occurred while processing your withdrawal');
  });

  it('should handle loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useWithdrawal as any).mockReturnValue({
      withdraw: withdrawMock,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useWithdrawalForm());

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle withdrawal error from store', () => {
    const testError = new Error('Insufficient funds');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useWithdrawal as any).mockReturnValue({
      withdraw: withdrawMock,
      isLoading: false,
      error: testError,
    });

    const { result } = renderHook(() => useWithdrawalForm());

    expect(result.current.withdrawalError).toBe(testError);
  });

  it('should not call onSuccess if not provided', async () => {
    const { result } = renderHook(() => useWithdrawalForm());

    await act(async () => {
      await result.current.handleSubmit({ amount: '100' });
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});
