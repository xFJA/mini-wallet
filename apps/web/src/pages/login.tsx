import LoginForm from '@/features/auth/LoginForm';
import { useAuth } from '@mini-wallet/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const isAlreadyAuthenticated = checkAuth();
    if (isAlreadyAuthenticated) {
      navigate('/dashboard');
    }
  }, [checkAuth, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary opacity-20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-secondary opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-accent opacity-15 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      <div
        className={`sm:mx-auto sm:w-full sm:max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="animated-border">
          <div className="glass-card p-8">
            <div className="flex justify-center mb-8">
              <div
                className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                style={{ boxShadow: 'var(--glow-primary)' }}
              >
                <span className="text-white font-bold text-2xl">MW</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground to-secondary mb-8">
              Mini Wallet
            </h1>
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
