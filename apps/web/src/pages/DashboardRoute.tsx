import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';

export function DashboardRoute() {
  const navigate = useNavigate();

  const handleBoardSelect = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  return <Dashboard onBoardSelect={handleBoardSelect} />;
}
