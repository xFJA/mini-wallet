import { useBalance } from '@mini-wallet/store';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { formatCurrency } from '@/utils';

const BalanceCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-lg shadow p-6 h-full">
    <h2 className="text-lg font-medium text-gray-500 mb-1">Current Balance</h2>
    {children}
  </div>
);

export const AccountBalance: React.FC = () => {
  const { balance, isLoading, error, fetchBalance } = useBalance();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formattedBalance = formatCurrency(balance);

  if (isLoading) {
    return (
      <BalanceCard>
        <Skeleton height={32} width={120} borderRadius={4} />
      </BalanceCard>
    );
  }

  if (error) {
    return (
      <BalanceCard>
        <div className="text-red-500">Error loading balance</div>
      </BalanceCard>
    );
  }

  return (
    <BalanceCard>
      <div className="text-3xl font-bold text-gray-900">{formattedBalance}</div>
    </BalanceCard>
  );
};

export default AccountBalance;
