import LoginForm from '@/features/auth/LoginForm';
import { useAuth } from '@mini-wallet/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
