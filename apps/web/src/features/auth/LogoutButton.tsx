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
    <Button onClick={handleLogout} variant="secondary" size="sm" fullWidth={false}>
      Logout
    </Button>
  );
};

export default LogoutButton;
