import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import HabitList from './pages/HabitList';
import DailyMeditationDetail from './pages/DailyMeditationDetail';
import AlgorithmStudyDetail from './pages/AlgorithmStudyDetail';
import Placeholder from './pages/Placeholder';
import Settings from './pages/Settings';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitList /></ProtectedRoute>} />
      <Route path="/habits/daily-meditation" element={<ProtectedRoute><DailyMeditationDetail /></ProtectedRoute>} />
      <Route path="/habits/algorithm-study" element={<ProtectedRoute><AlgorithmStudyDetail /></ProtectedRoute>} />
      <Route path="/statistics" element={<ProtectedRoute><Placeholder title="Statistics" /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><Placeholder title="Rewards" /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
