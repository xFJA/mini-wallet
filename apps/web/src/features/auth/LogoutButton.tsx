import { useNavigate } from 'react-router-dom';
import { useAuth } from '@mini-wallet/store';
import Button from '@/components/Button';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
