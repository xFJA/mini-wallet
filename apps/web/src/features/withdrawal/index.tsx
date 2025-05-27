import Button from '@/components/Button';
import { useAccountData, useTransactions, useWithdrawal } from '@mini-wallet/store';

import { useState } from 'react';

interface WithdrawalFormProps {
  onSuccess?: () => void;
}

export const Withdrawal: React.FC<WithdrawalFormProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { withdraw, isLoading, error: withdrawalError } = useWithdrawal();
  const { refreshAccountData } = useAccountData();
  const { fetchTransactions } = useTransactions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setAmount('');
      setSuccessMessage('Processing withdrawal...');

      await withdraw(numAmount);

      setSuccessMessage('Withdrawal successful!');

      setTimeout(async () => {
        try {
          await Promise.all([refreshAccountData(), fetchTransactions()]);
          if (onSuccess) onSuccess();
        } catch (refreshError) {
          console.error('Error refreshing data:', refreshError);
        }
      }, 500);
    } catch (err) {
      setError('An error occurred while processing your withdrawal');
      console.error('Withdrawal error:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Withdraw Funds</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              $
            </span>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {withdrawalError && !error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {withdrawalError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
            {successMessage}
          </div>
        )}

        <Button type="submit" loading={isLoading} disabled={isLoading || !amount}>
          Withdraw
        </Button>
      </form>
    </div>
  );
};

export default Withdrawal;
