import Table from '@/components/Table';
import { formatCurrency, formatDate } from '@/utils';
import { useTransactions } from '@mini-wallet/store';
import { Transaction } from '@mini-wallet/types';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type SortDirection = 'asc' | 'desc';

interface TransactionListProps {}

export const Transactions: React.FC<TransactionListProps> = () => {
  const { transactions, isLoading, error, fetchTransactions } = useTransactions();
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchTransactions();
      setInitialLoaded(true);
    };

    if (!initialLoaded) {
      loadInitialData();
    }
  }, [fetchTransactions, initialLoaded]);

  useEffect(() => {
    if (transactions.length > 0) {
      // TODO: Move to mock API
      const sorted = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
      setSortedTransactions(sorted);
    } else {
      setSortedTransactions([]);
    }
  }, [transactions, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            accessor: (transaction) => (
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                  transaction.status
                )}`}
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            ),
          },
        ]}
        data={sortedTransactions}
        keyExtractor={(transaction) => transaction.id}
        emptyMessage="No transactions found"
      />
    </div>
  );
};

export default Transactions;
