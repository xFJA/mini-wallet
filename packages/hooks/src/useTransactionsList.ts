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
    const loadInitialData = async () => {
      await fetchTransactions({
        sortDirection: initialSortDirection,
        page: initialPage,
      });
      setInitialLoaded(true);
    };

    if (!initialLoaded) {
      loadInitialData();
    } else {
      fetchTransactions({ sortDirection, page: currentPage });
    }
  }, [
    fetchTransactions,
    initialLoaded,
    initialPage,
    initialSortDirection,
    sortDirection,
    currentPage,
  ]);

  useEffect(() => {
    setSortedTransactions(transactions.slice(0, pageSize));
  }, [transactions, pageSize]);

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    fetchTransactions({ sortDirection: newDirection, page: 1 });
  };

  const handlePageChange = (page: number) => {
    fetchTransactions({ sortDirection, page });
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
