import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { useWithdrawalForm } from '@mini-wallet/hooks';
import { useState, useEffect } from 'react';

interface WithdrawalProps {
  onSuccess?: () => void;
}

export const Withdrawal: React.FC<WithdrawalProps> = ({ onSuccess }) => {
  const { register, handleSubmit, errors, isLoading, error, withdrawalError, successMessage } =
    useWithdrawalForm({ onSuccess });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`glass-card p-6 hover-card transition-all duration-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-primary-foreground">Withdraw Funds</h2>
      </div>

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
          <div className="mb-4 p-3 border border-destructive/30 rounded-md bg-destructive/10 text-destructive flex items-center space-x-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {withdrawalError && !error && (
          <div className="mb-4 p-3 border border-destructive/30 rounded-md bg-destructive/10 text-destructive flex items-center space-x-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{withdrawalError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 border border-green-500/30 rounded-md bg-green-500/10 text-green-500 flex items-center space-x-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Withdraw'}
        </Button>
      </form>
    </div>
  );
};

export default Withdrawal;
