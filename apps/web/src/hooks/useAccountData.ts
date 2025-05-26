import { AccountData } from '@mini-wallet/types';
import { useEffect, useState } from 'react';

interface UseAccountDataResult {
  accountData: AccountData;
  isLoading: boolean;
  error: Error | null;
}

export function useAccountData(): UseAccountDataResult {
  const [accountData, setAccountData] = useState<AccountData>({
    balance: 1250.75,
    currency: 'USD',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setAccountData({
          balance: 1250.75,
          currency: 'USD',
        });
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    accountData,
    isLoading,
    error,
  };
}

export default useAccountData;
