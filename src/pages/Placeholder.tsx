import { useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Trophy,
  Settings,
  Bell,
  Zap
} from 'lucide-react';
import './Dashboard.css';

export default function Placeholder({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">Kinetic</div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end>
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/habits" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <CheckSquare className="nav-icon" size={20} />
            <span>Habit List</span>
          </NavLink>
          <NavLink to="/statistics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <BarChart2 className="nav-icon" size={20} />
            <span>Statistics</span>
          </NavLink>
          <NavLink to="/rewards" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Trophy className="nav-icon" size={20} />
            <span>Rewards</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Settings className="nav-icon" size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="user-profile" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} title="Go to settings">
          <div className="user-avatar">
            <span role="img" aria-label="avatar">👨‍💼</span>
          </div>
          <div className="user-info">
            <span className="user-level">Level 24</span>
            <span className="user-title">Master Architect</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="header-top">
          <Bell size={24} color="#a1a1aa" />
          <div className="pts-badge">
            <Zap size={16} fill="currentColor" />
            1,250 PTS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 80px)' }}>
          <h1>{title}</h1>
          <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>This page is not yet implemented.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#a855f7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
