import { useEffect, useState } from 'react';
import { useBoardsStore } from './hooks/useBoards';
import { useAuthStore } from './hooks/useAuth';
import { BoardSidebar } from './components/BoardSidebar';
import { WhiteboardCanvas } from './components/WhiteboardCanvas';
import { Header } from './components/Header';
import { AuthDialog } from './components/AuthDialog';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

type AppView = 'landing' | 'auth' | 'dashboard' | 'whiteboard';

function App() {
  const { isAuthenticated, loadUser, isLoading: authLoading } = useAuthStore();
  const { loadBoards, selectBoard, currentBoard, isLoading: boardsLoading } = useBoardsStore();
  const [view, setView] = useState<AppView>('landing');

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBoards();
      // If authenticated, skip landing and go to dashboard
      if (view === 'landing' || view === 'auth') {
        setView('dashboard');
      }
    } else {
      // Not authenticated, show landing
      if (view === 'dashboard' || view === 'whiteboard') {
        setView('landing');
      }
    }
  }, [isAuthenticated, loadBoards]);

  const handleGetStarted = () => {
    setView('auth');
  };

  const handleShowLanding = () => {
    setView('landing');
  };

  const handleBoardSelect = async (boardId: string) => {
    await selectBoard(boardId);
    setView('whiteboard');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 animate-pulse">
            M
          </div>
          <p className="text-muted-foreground">Loading Maplify Tech...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated and on landing view
  if (!isAuthenticated && view === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show auth dialog if not authenticated
  if (!isAuthenticated) {
    return <AuthDialog showLanding={true} onShowLanding={handleShowLanding} />;
  }

  // Show dashboard view
  if (view === 'dashboard') {
    return <Dashboard onBoardSelect={handleBoardSelect} />;
  }

  // Show whiteboard view
  if (view === 'whiteboard' && currentBoard) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <BoardSidebar onBoardSelect={handleBoardSelect} onBackToDashboard={handleBackToDashboard} />
          <main className="flex-1 overflow-hidden">
            <WhiteboardCanvas />
          </main>
        </div>
      </div>
    );
  }

  // Default: show loading or redirect to dashboard
  if (boardsLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 animate-pulse">
            M
          </div>
          <p className="text-muted-foreground">Loading your boards...</p>
        </div>
      </div>
    );
  }

  return <Dashboard onBoardSelect={handleBoardSelect} />;
}

export default App;
