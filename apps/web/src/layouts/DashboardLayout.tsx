import LogoutButton from '@/features/auth/LogoutButton';
import { useAuth } from '@mini-wallet/store';
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mini Wallet</h1>
            {user && <p className="text-sm text-gray-600">Welcome, {user.email}</p>}
          </div>
          <LogoutButton />
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
