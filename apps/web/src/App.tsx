import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuth';
import { useBoardsStore } from './hooks/useBoards';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPageRoute } from './pages/LandingPageRoute';
import { LoginRoute } from './pages/LoginRoute';
import { DashboardRoute } from './pages/DashboardRoute';
import { WhiteboardRoute } from './pages/WhiteboardRoute';

function AppContent() {
  const { loadUser } = useAuthStore();
  const { isAuthenticated } = useAuthStore();
  const { loadBoards } = useBoardsStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBoards();
    }
  }, [isAuthenticated, loadBoards]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPageRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board/:boardId"
        element={
          <ProtectedRoute>
            <WhiteboardRoute />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
