import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccountData, useTransactions, useWithdrawal } from '@mini-wallet/store';
import { WithdrawalFormValues, withdrawalFormSchema } from '@mini-wallet/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface WithdrawalFormProps {
  onSuccess?: () => void;
}

export const Withdrawal: React.FC<WithdrawalFormProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { withdraw, isLoading, error: withdrawalError } = useWithdrawal();
  const { fetchAccountData } = useAccountData();
  const { fetchTransactions } = useTransactions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: '',
    },
  });

  const onSubmit = async (data: WithdrawalFormValues) => {
    setError(null);
    setSuccessMessage(null);

    const numAmount = parseFloat(data.amount);

    try {
      reset();
      setSuccessMessage('Processing withdrawal...');

      await withdraw(numAmount);

      setSuccessMessage('Withdrawal successful!');

      setTimeout(async () => {
        try {
          await Promise.all([fetchAccountData(), fetchTransactions()]);
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="amount"
          label="Amount (USD)"
          type="number"
          step="0.01"
          min="0.01"
          {...register('amount')}
          placeholder="0.00"
          disabled={isLoading}
          startAdornment={'$'}
          error={errors.amount?.message}
          containerClassName="mb-4"
        />

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

        <Button type="submit" variant="primary" size="md" loading={isLoading} disabled={isLoading}>
          Withdraw
        </Button>
      </form>
    </div>
  );
};

export default Withdrawal;
