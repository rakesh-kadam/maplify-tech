import { useEffect } from 'react';
import { useBoardsStore } from './hooks/useBoards';
import { useAuthStore } from './hooks/useAuth';
import { BoardSidebar } from './components/BoardSidebar';
import { WhiteboardCanvas } from './components/WhiteboardCanvas';
import { Header } from './components/Header';
import { AuthDialog } from './components/AuthDialog';

function App() {
  const { isAuthenticated, loadUser, isLoading: authLoading } = useAuthStore();
  const { loadBoards, isLoading: boardsLoading } = useBoardsStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBoards();
    }
  }, [isAuthenticated, loadBoards]);

  // Show auth dialog if not authenticated
  if (!isAuthenticated) {
    return <AuthDialog />;
  }

  // Show loading state while loading boards
  if (authLoading || boardsLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            M
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading Maplify Tech...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <BoardSidebar />
        <main className="flex-1 overflow-hidden">
          <WhiteboardCanvas />
        </main>
      </div>
    </div>
  );
}

export default App;
