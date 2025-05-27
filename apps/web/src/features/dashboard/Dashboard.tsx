import { useAccountData } from '@mini-wallet/hooks';
import AccountBalance from '../../components/AccountBalance';
import TransactionList from '../../components/TransactionList';
import WithdrawSection from '../../components/WithdrawSection';

export const Dashboard: React.FC = () => {
  const { accountData, isLoading, error } = useAccountData();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Mini Wallet</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <AccountBalance balance={accountData.balance} isLoading={isLoading} />
            </div>
            <WithdrawSection />
          </div>

          <div className="mt-6">
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
