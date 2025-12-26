import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoardsStore } from '../hooks/useBoards';
import { BoardSidebar } from '../components/BoardSidebar';
import { WhiteboardCanvas } from '../components/WhiteboardCanvas';
import { Header } from '../components/Header';

export function WhiteboardRoute() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { selectBoard, currentBoard, currentBoardId, isLoading } = useBoardsStore();

  useEffect(() => {
    if (boardId && boardId !== currentBoardId) {
      selectBoard(boardId);
    }
  }, [boardId, currentBoardId, selectBoard]);

  const handleBoardSelect = (newBoardId: string) => {
    navigate(`/board/${newBoardId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 animate-pulse">
            M
          </div>
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Board not found</p>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <BoardSidebar 
          onBoardSelect={handleBoardSelect} 
          onBackToDashboard={handleBackToDashboard} 
        />
        <main className="flex-1 overflow-hidden">
          <WhiteboardCanvas />
        </main>
      </div>
    </div>
  );
}
