import { Transaction } from '@mini-wallet/types';
import { act, renderHook } from '@testing-library/react';

import { useTransactions } from '@mini-wallet/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransactionsList } from './useTransactionsList';

vi.mock('@mini-wallet/store', () => ({
  useTransactions: vi.fn(),
}));

describe('useTransactionsList [hook]', () => {
  const mockTransactions: Transaction[] = [
    { id: '1', amount: 100, date: '2025-05-27T10:00:00Z', status: 'completed' },
    { id: '2', amount: -50, date: '2025-05-26T10:00:00Z', status: 'completed' },
    { id: '3', amount: 200, date: '2025-05-25T10:00:00Z', status: 'completed' },
    { id: '4', amount: -75, date: '2025-05-24T10:00:00Z', status: 'completed' },
    { id: '5', amount: 300, date: '2025-05-23T10:00:00Z', status: 'completed' },
    { id: '6', amount: -25, date: '2025-05-22T10:00:00Z', status: 'completed' },
  ];

  const fetchTransactionsMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    // Using 'as any' is necessary here because Vitest's typing system doesn't properly recognize mocked modules
    // This is a temporary solution until we can find a better typing approach
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useTransactions as any).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
      error: null,
      fetchTransactions: fetchTransactionsMock,
      currentPage: 1,
      totalPages: 2,
    });
  });

  const waitForHookToUpdate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  it('should fetch transactions on mount with default parameters', async () => {
    renderHook(() => useTransactionsList());

    // Wait for useEffect to run
    await waitForHookToUpdate();

    // Initial load
    expect(fetchTransactionsMock).toHaveBeenCalledWith({
      sortDirection: 'desc',
      page: 1,
    });
  });

  it('should fetch transactions with custom initial parameters', async () => {
    renderHook(() =>
      useTransactionsList({
        initialPage: 2,
        initialSortDirection: 'asc',
        pageSize: 10,
      })
    );

    await waitForHookToUpdate();

    expect(fetchTransactionsMock).toHaveBeenCalledWith({
      sortDirection: 'asc',
      page: 2,
    });
  });

  it('should limit transactions to pageSize', async () => {
    const { result } = renderHook(() => useTransactionsList({ pageSize: 3 }));

    await waitForHookToUpdate();

    expect(result.current.transactions.length).toBe(3);
  });

  it('should toggle sort direction and fetch new data', async () => {
    const { result } = renderHook(() => useTransactionsList());

    await waitForHookToUpdate();

    // Initial state
    expect(result.current.sortDirection).toBe('desc');

    // Toggle sort direction
    await act(async () => {
      result.current.toggleSortDirection();
      await waitForHookToUpdate();
    });

    expect(result.current.sortDirection).toBe('asc');
    expect(fetchTransactionsMock).toHaveBeenCalledWith({
      sortDirection: 'asc',
      page: 1,
    });
  });

  it('should handle page changes', async () => {
    const { result } = renderHook(() => useTransactionsList());

    await waitForHookToUpdate();

    // Change page
    await act(async () => {
      result.current.handlePageChange(2);
      await waitForHookToUpdate();
    });

    expect(fetchTransactionsMock).toHaveBeenCalledWith({
      sortDirection: 'desc',
      page: 2,
    });
  });

  it('should handle loading state', async () => {
    // Using 'as any' is necessary here because Vitest's typing system doesn't properly recognize mocked modules
    // This is a temporary solution until we can find a better typing approach
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useTransactions as any).mockReturnValue({
      transactions: [],
      isLoading: true,
      error: null,
      fetchTransactions: fetchTransactionsMock,
      currentPage: 1,
      totalPages: 1,
    });

    const { result } = renderHook(() => useTransactionsList());

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', async () => {
    const testError = new Error('Failed to fetch transactions');
    // Using 'as any' is necessary here because Vitest's typing system doesn't properly recognize mocked modules
    // This is a temporary solution until we can find a better typing approach
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useTransactions as any).mockReturnValue({
      transactions: [],
      isLoading: false,
      error: testError,
      fetchTransactions: fetchTransactionsMock,
      currentPage: 1,
      totalPages: 1,
    });

    const { result } = renderHook(() => useTransactionsList());

    expect(result.current.error).toBe(testError);
  });
});
