import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import Table from '@/components/Table';
import { formatCurrency, formatDate } from '@/utils';
import { useTransactions } from '@mini-wallet/store';
import { SortDirection, Transaction } from '@mini-wallet/types';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSearchParams } from 'react-router-dom';

interface TransactionListProps {}

export const Transactions: React.FC<TransactionListProps> = () => {
  const { transactions, isLoading, error, fetchTransactions, currentPage, totalPages } =
    useTransactions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (searchParams.get('sort') as SortDirection) || 'desc'
  );
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  useEffect(() => {
    const urlPage = searchParams.get('page');
    const urlSort = searchParams.get('sort');

    const initialPage = urlPage ? parseInt(urlPage, 10) : 1;
    const initialSort = (urlSort as SortDirection) || 'desc';

    const loadInitialData = async () => {
      await fetchTransactions({
        sortDirection: initialSort,
        page: initialPage,
      });
      setInitialLoaded(true);
    };

    if (!initialLoaded) {
      loadInitialData();
    } else {
      fetchTransactions({ sortDirection, page: currentPage });
    }
  }, [fetchTransactions, initialLoaded, searchParams]);

  useEffect(() => {
    if (initialLoaded) {
      setSearchParams({
        page: currentPage.toString(),
        sort: sortDirection,
      });
    }
  }, [currentPage, sortDirection, initialLoaded, setSearchParams]);

  useEffect(() => {
    // Only show 5 transactions per page, even if there are pending transactions
    // that would make the total more than 5
    const pageSize = 5;
    setSortedTransactions(transactions.slice(0, pageSize));
  }, [transactions]);

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    fetchTransactions({ sortDirection: newDirection, page: 1 });
  };

  const handlePageChange = (page: number) => {
    fetchTransactions({ sortDirection, page });
  };

  if (isLoading && !initialLoaded) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton width={80} height={24} />
              <Skeleton width={140} height={24} />
              <Skeleton width={100} height={24} />
              <Skeleton width={80} height={24} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-600">
          Error loading transactions. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        <button
          onClick={toggleSortDirection}
          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
        >
          <span>Sort by Date</span>
          <span className="ml-1">
            {sortDirection === 'desc' ? '↓ (newest first)' : '↑ (oldest first)'}
          </span>
        </button>
      </div>

      <Table<Transaction>
        columns={[
          {
            header: 'ID',
            accessor: (transaction) => transaction.id.substring(0, 8),
          },
          {
            header: 'Date',
            accessor: (transaction) => formatDate(transaction.date),
          },
          {
            header: 'Amount',
            accessor: (transaction) => formatCurrency(transaction.amount),
            className: 'font-medium text-gray-900',
          },
          {
            header: 'Status',
            accessor: (transaction) => <StatusBadge status={transaction.status} />,
          },
        ]}
        data={sortedTransactions}
        keyExtractor={(transaction) => transaction.id}
        emptyMessage="No transactions found"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-4"
      />
    </div>
  );
};

export default Transactions;
