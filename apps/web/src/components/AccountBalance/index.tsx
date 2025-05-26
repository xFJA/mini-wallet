import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface AccountBalanceProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

const BalanceCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-lg shadow p-6 h-full">
    <h2 className="text-lg font-medium text-gray-500 mb-1">Current Balance</h2>
    {children}
  </div>
);

export const AccountBalance: React.FC<AccountBalanceProps> = ({
  balance,
  currency = 'USD',
  isLoading = false,
}) => {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  if (isLoading) {
    return (
      <BalanceCard>
        <Skeleton height={32} width={120} borderRadius={4} />
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
