import Table from '@/components/Table';
import { formatCurrency, formatDate } from '@/utils';
import StatusBadge from '@/components/StatusBadge';
import { useTransactions } from '@mini-wallet/store';
import { SortDirection, Transaction } from '@mini-wallet/types';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TransactionListProps {}

export const Transactions: React.FC<TransactionListProps> = () => {
  const { transactions, isLoading, error, fetchTransactions } = useTransactions();
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchTransactions(sortDirection);
      setInitialLoaded(true);
    };

    if (!initialLoaded) {
      loadInitialData();
    } else {
      fetchTransactions(sortDirection);
    }
  }, [fetchTransactions, initialLoaded, sortDirection]);

  useEffect(() => {
    setSortedTransactions(transactions);
  }, [transactions]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
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
    </div>
  );
};

export default Transactions;
