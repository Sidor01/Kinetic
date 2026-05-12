import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
<<<<<<< HEAD
import HabitList from './pages/HabitList';
=======
>>>>>>> 553f5ba4b0e8a13ba7b6a2e51a5a2da951bcc6df
import Placeholder from './pages/Placeholder';
import Settings from './pages/Settings';
import './App.css';

// A simple protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userStr = localStorage.getItem('kinetic_currentUser');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
<<<<<<< HEAD
        <Route path="/habits" element={<ProtectedRoute><HabitList /></ProtectedRoute>} />
=======
        <Route path="/habits" element={<ProtectedRoute><Placeholder title="Habit List" /></ProtectedRoute>} />
>>>>>>> 553f5ba4b0e8a13ba7b6a2e51a5a2da951bcc6df
        <Route path="/statistics" element={<ProtectedRoute><Placeholder title="Statistics" /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><Placeholder title="Rewards" /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
