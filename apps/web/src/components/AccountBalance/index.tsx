import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface AccountBalanceProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

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
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <h2 className="text-lg font-medium text-gray-500 mb-1">Current Balance</h2>
        <Skeleton height={32} width={120} borderRadius={4} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h2 className="text-lg font-medium text-gray-500 mb-1">Current Balance</h2>
      <div className="text-3xl font-bold text-gray-900">{formattedBalance}</div>
    </div>
  );
};

export default AccountBalance;
