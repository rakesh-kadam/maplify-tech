import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthDialog } from '../components/AuthDialog';
import { useAuthStore } from '../hooks/useAuth';

export function LoginRoute() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleShowLanding = () => {
    navigate('/');
  };

  return <AuthDialog showLanding={true} onShowLanding={handleShowLanding} />;
}
