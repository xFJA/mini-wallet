import { useAccountBalance } from '@mini-wallet/hooks';
import { useEffect, useState } from 'react';

const BalanceCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      const element = document.getElementById('balance-card');
      if (element) {
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 2000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="balance-card"
      className={`glass-card hover-card p-6 h-full transition-all duration-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-primary-foreground">Current Balance</h2>
      </div>
      {children}
    </div>
  );
};

export const AccountBalance: React.FC = () => {
  const { formattedBalance, isLoading, error } = useAccountBalance();
  const [animateValue, setAnimateValue] = useState(false);

  useEffect(() => {
    if (!isLoading && !error) {
      setTimeout(() => setAnimateValue(true), 300);
    }
  }, [isLoading, error]);

  if (isLoading) {
    return (
      <BalanceCard>
        <div className="shimmer h-10 w-40 rounded-md bg-muted/30"></div>
      </BalanceCard>
    );
  }

  if (error) {
    return (
      <BalanceCard>
        <div className="text-destructive flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Error loading balance: {error.message}</span>
        </div>
      </BalanceCard>
    );
  }

  return (
    <BalanceCard>
      <div
        className={`transition-all duration-1000 ${animateValue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground to-secondary">
          {formattedBalance}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">Updated just now</div>
      </div>
    </BalanceCard>
  );
};

export default AccountBalance;
