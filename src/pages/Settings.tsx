import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Trophy,
  Settings as SettingsIcon,
  Bell,
  Zap,
  Shield,
  Download,
  Pen,
  Activity
} from 'lucide-react';
import './Dashboard.css';

interface User {
  id?: string;
  name?: string;
  email: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('kinetic_currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  });

  const [publicProfile, setPublicProfile] = useState(false);
  const [leaderboard, setLeaderboard] = useState(true);

  const [smartReminders, setSmartReminders] = useState(true);
  const [streakProtection, setStreakProtection] = useState(true);
  const [turnOffAlerts, setTurnOffAlerts] = useState(false);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('kinetic_currentUser');
    setUser(null);
    navigate('/login');
  };

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
            <SettingsIcon className="nav-icon" size={20} />
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

        <div className="settings-content">
          <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 48px 0', letterSpacing: '-1px' }}>Configuration</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* Profile Card */}
            <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                  👨‍💼
                </div>
                <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#3f3f46', borderRadius: '50%', padding: '6px', display: 'flex', cursor: 'pointer' }}>
                  <Pen size={14} color="#ffffff" />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ backgroundColor: 'rgba(46, 16, 101, 0.5)', color: '#d8b4fe', padding: '6px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', display: 'inline-block', marginBottom: '16px' }}>
                  LEVEL 24 • MASTER ARCHITECT
                </div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 600 }}>{user.name || 'Alex Vance'}</h2>
                <div style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '24px' }}>{user.email || 'alex.vance@kinetic.app'}</div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <button style={{ backgroundColor: '#27272a', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 0.2s' }}>Edit Profile</button>
                  <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: '#f87171', border: 'none', fontWeight: 500, cursor: 'pointer', padding: 0 }}>Sign Out</button>
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Privacy</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px' }}>Public Profile</div>
                  <Toggle isOn={publicProfile} onToggle={() => setPublicProfile(!publicProfile)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px' }}>Leaderboard</div>
                  <Toggle isOn={leaderboard} onToggle={() => setLeaderboard(!leaderboard)} />
                </div>
              </div>
            </div>

            {/* Signal Flow Card */}
            <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Signal Flow</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>Smart Reminders</div>
                    <div style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.4 }}>Contextual nudges based on your typical completion times.</div>
                  </div>
                  <Toggle isOn={smartReminders} onToggle={() => setSmartReminders(!smartReminders)} color="#c084fc" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>Streak Protection Alerts</div>
                    <div style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.4 }}>Critical warnings when you're 2 hours away from losing a 7+ day streak.</div>
                  </div>
                  <Toggle isOn={streakProtection} onToggle={() => setStreakProtection(!streakProtection)} color="#c084fc" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>Turn off alerts</div>
                    <div style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.4 }}>Turn off any kind of alerts</div>
                  </div>
                  <Toggle isOn={turnOffAlerts} onToggle={() => setTurnOffAlerts(!turnOffAlerts)} />
                </div>
              </div>
            </div>

            {/* Data Vault Card */}
            <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(192, 132, 252, 0.1)', color: '#c084fc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Data Vault</h3>
              </div>
              
              <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.5, margin: '0 0 32px 0' }}>
                Your progress is strictly yours.<br/>
                Export your complete habit history<br/>
                as a CSV or JSON payload.
              </p>

              <button style={{ backgroundColor: '#27272a', color: '#d8b4fe', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginTop: 'auto', transition: 'background-color 0.2s' }}>
                <Download size={16} />
                Request Export
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Simple toggle component
function Toggle({ isOn, onToggle, color = '#38bdf8' }: { isOn: boolean; onToggle: () => void; color?: string }) {
  return (
    <div 
      onClick={onToggle}
      style={{
        width: '44px',
        height: '24px',
        backgroundColor: isOn ? color : '#3f3f46',
        borderRadius: '12px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0
      }}
    >
      <div 
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: isOn ? '22px' : '2px',
          transition: 'left 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
}
