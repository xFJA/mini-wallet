import { useEffect, useState } from 'react';
import { AccountData } from '../types';

export function useAccountData() {
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
