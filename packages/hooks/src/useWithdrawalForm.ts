import { zodResolver } from '@hookform/resolvers/zod';
import { useAccountData, useTransactions, useWithdrawal } from '@mini-wallet/store';
import { WithdrawalFormValues, withdrawalFormSchema } from '@mini-wallet/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseWithdrawalFormOptions {
  onSuccess?: () => void;
}

export function useWithdrawalForm({ onSuccess }: UseWithdrawalFormOptions = {}) {
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
          // eslint-disable-next-line no-console
          console.error('Error refreshing data:', refreshError);
        }
      }, 500);
    } catch (err) {
      setError('An error occurred while processing your withdrawal');
      // eslint-disable-next-line no-console
      console.error('Withdrawal error:', err);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    error,
    withdrawalError,
    successMessage,
  };
}
