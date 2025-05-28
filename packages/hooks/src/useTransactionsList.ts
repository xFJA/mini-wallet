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
  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    if (!initialLoaded) {
      fetchTransactions({ sortDirection: initialSortDirection, page: initialPage, pageSize });
      setInitialLoaded(true);
    }
  }, [fetchTransactions, initialLoaded, initialPage, initialSortDirection, pageSize]);

  useEffect(() => {
    setSortedTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    if (initialLoaded && currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, initialLoaded, page]);

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    setPage(1);
    fetchTransactions({ sortDirection: newDirection, page: 1, pageSize });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;
    setPage(newPage);
    fetchTransactions({ sortDirection, page: newPage, pageSize });
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
