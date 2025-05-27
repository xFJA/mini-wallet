import AccountBalance from '@/features/balance';
import Transactions from '@/features/transactions';
import Withdrawal from '@/features/withdrawal';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAccountData } from '@mini-wallet/store';

export const DashboardPage = () => {
  const { error } = useAccountData();

  return (
    <DashboardLayout>
      {error && (
        <div
          className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error?.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <AccountBalance />
        </div>
        <div>
          <Withdrawal />
        </div>
      </div>

      <div className="mt-6">
        <Transactions />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
