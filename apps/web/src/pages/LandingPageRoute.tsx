import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/LandingPage';
import { useAuthStore } from '../hooks/useAuth';

export function LandingPageRoute() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
}
