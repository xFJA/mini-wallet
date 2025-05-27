import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { useWithdrawalForm } from '@mini-wallet/hooks';

interface WithdrawalProps {
  onSuccess?: () => void;
}

export const Withdrawal: React.FC<WithdrawalProps> = ({ onSuccess }) => {
  const { register, handleSubmit, errors, isLoading, error, withdrawalError, successMessage } =
    useWithdrawalForm({ onSuccess });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Withdraw Funds</h2>

      <form onSubmit={handleSubmit}>
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
