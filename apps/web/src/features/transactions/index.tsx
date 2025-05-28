import Pagination from '@/components/Pagination';
import StatusBadge from '@/components/StatusBadge';
import Table from '@/components/Table';
import { formatCurrency, formatDate } from '@/utils';
import { useTransactionsList } from '@mini-wallet/hooks';
import { SortDirection, Transaction } from '@mini-wallet/types';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface TransactionListProps {}

export const Transactions: React.FC<TransactionListProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = searchParams.get('page');
  const urlSort = searchParams.get('sort');
  const initialPage = urlPage ? parseInt(urlPage, 10) : 1;
  const initialSortDirection = (urlSort as SortDirection) || 'desc';

  const {
    transactions,
    isLoading,
    error,
    initialLoaded,
    currentPage,
    totalPages,
    sortDirection,
    toggleSortDirection,
    handlePageChange,
  } = useTransactionsList({
    initialPage,
    initialSortDirection,
  });

  useEffect(() => {
    if (initialLoaded) {
      setSearchParams({
        page: currentPage.toString(),
        sort: sortDirection,
      });
    }
  }, [currentPage, sortDirection, initialLoaded, setSearchParams]);

  if (isLoading && !initialLoaded) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-primary-foreground">Transaction History</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="shimmer h-6 w-20 rounded-md bg-muted/30"></div>
              <div className="shimmer h-6 w-32 rounded-md bg-muted/30"></div>
              <div className="shimmer h-6 w-24 rounded-md bg-muted/30"></div>
              <div className="shimmer h-6 w-20 rounded-md bg-muted/30"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-primary-foreground">Transaction History</h2>
        </div>
        <div className="p-4 border border-destructive/30 rounded-md bg-destructive/10 text-destructive flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Error loading transactions. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animated-border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-primary-foreground">Transaction History</h2>
        </div>
        <button
          onClick={toggleSortDirection}
          className="text-sm flex items-center text-secondary hover:text-secondary/80 transition-colors duration-200 px-3 py-1 glass-card"
        >
          <span>Sort by Date</span>
          <span className="ml-1">
            {sortDirection === 'desc' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
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
            accessor: (transaction) => (
              <span className="font-semibold text-lg text-white">
                {formatCurrency(transaction.amount)}
              </span>
            ),
            className: '',
          },
          {
            header: 'Status',
            accessor: (transaction) => <StatusBadge status={transaction.status} />,
          },
        ]}
        data={transactions}
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
