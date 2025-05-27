import { AccountData } from '@mini-wallet/types';
import { useEffect, useState } from 'react';

interface UseAccountDataResult {
  accountData: AccountData;
  isLoading: boolean;
  error: Error | null;
}

export function useAccountData(): UseAccountDataResult {
  const [accountData, setAccountData] = useState<AccountData>({
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('/api/wallet');

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: AccountData = await response.json();
        setAccountData(data);
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
