import LogoutButton from '@/features/auth/LogoutButton';
import { useAuth } from '@mini-wallet/store';
import React, { ReactNode, useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-muted/20 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      <header
        className={`glass-card sticky top-0 z-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div
              className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              style={{ boxShadow: 'var(--glow-primary)' }}
            >
              <span className="text-white font-bold text-lg">MW</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground to-secondary">
                Mini Wallet
              </h1>
              {user && (
                <p className="text-sm text-muted-foreground transition-all duration-300 hover:text-primary">
                  Welcome, {user.email}
                </p>
              )}
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main
        className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-8 mb-4">
        <div className="animated-border">
          <div className="glass-card p-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mini Wallet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
