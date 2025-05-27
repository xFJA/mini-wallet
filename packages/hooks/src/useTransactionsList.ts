import { useTransactions } from '@mini-wallet/store';
import { SortDirection, Transaction } from '@mini-wallet/types';
import { useEffect, useState } from 'react';

interface UseTransactionsListOptions {
  initialPage?: number;
  initialSortDirection?: SortDirection;
  pageSize?: number;
}

export function useTransactionsList({
  initialPage = 1,
  initialSortDirection = 'desc',
  pageSize = 5,
}: UseTransactionsListOptions = {}) {
  const { transactions, isLoading, error, fetchTransactions, currentPage, totalPages } =
    useTransactions();

  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Define loadInitialData inside useEffect to avoid dependency issues
    const loadInitialData = () => {
      fetchTransactions({ sortDirection: initialSortDirection, page: initialPage, pageSize });
      setInitialLoaded(true);
    };

    if (!initialLoaded) {
      loadInitialData();
    } else {
      fetchTransactions({ sortDirection, page: currentPage, pageSize });
    }
  }, [
    fetchTransactions,
    initialLoaded,
    initialPage,
    initialSortDirection,
    sortDirection,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    // Don't slice the transactions as they're already paginated from the server
    setSortedTransactions(transactions);
  }, [transactions]);

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    fetchTransactions({ sortDirection: newDirection, page: currentPage, pageSize });
  };

  const handlePageChange = (page: number) => {
    fetchTransactions({ sortDirection, page, pageSize });
  };

  return {
    transactions: sortedTransactions,
    isLoading,
    error,
    initialLoaded,
    currentPage,
    totalPages,
    sortDirection,
    toggleSortDirection,
    handlePageChange,
  };
}
