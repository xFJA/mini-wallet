import { useBalance } from '@mini-wallet/store';
import { formatCurrency } from '@mini-wallet/utils';
import { useEffect } from 'react';

export function useAccountBalance() {
  const { balance, isLoading, error, fetchBalance } = useBalance();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formattedBalance = formatCurrency(balance);

  return {
    balance,
    formattedBalance,
    isLoading,
    error,
    fetchBalance,
  };
}
