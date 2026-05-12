import { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Trophy,
  Settings,
  Bell,
  Zap,
  Droplet,
  Check,
  Dumbbell,
  Sparkles,
  Star,
  Flame,
  Lock,
  Activity
} from 'lucide-react';
import './Dashboard.css';

interface User {
  id?: string;
  name?: string;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('kinetic_currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  });

  const [hydrationProgress, setHydrationProgress] = useState(() => {
    const saved = localStorage.getItem('kinetic_hydration');
    return saved ? parseInt(saved) : 1;
  });
  const [meditationDone, setMeditationDone] = useState(() => {
    const saved = localStorage.getItem('kinetic_meditation');
    return saved ? JSON.parse(saved) : true;
  });
  const [weightDone, setWeightDone] = useState(() => {
    const saved = localStorage.getItem('kinetic_weight');
    return saved ? JSON.parse(saved) : false;
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('kinetic_stats');
    return saved ? JSON.parse(saved) : {
      dayStreak: 15,
      dailyAvg: 4.8,
      focusTime: '4h 20m',
      energyLevel: 'High'
    };
  });

  useEffect(() => {
    localStorage.setItem('kinetic_hydration', hydrationProgress.toString());
    localStorage.setItem('kinetic_meditation', JSON.stringify(meditationDone));
    localStorage.setItem('kinetic_weight', JSON.stringify(weightDone));
    localStorage.setItem('kinetic_stats', JSON.stringify(stats));
  }, [hydrationProgress, meditationDone, weightDone, stats]);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('kinetic_currentUser');
    setUser(null);
    navigate('/login');
  };

  const completedTasksCount = hydrationProgress + (meditationDone ? 1 : 0) + (weightDone ? 1 : 0);
  const totalTasksCount = 5;
  const orbitPercentage = Math.round((completedTasksCount / totalTasksCount) * 100);

  const earnedXP = (hydrationProgress * 28) + (meditationDone ? 28 : 0) + (weightDone ? 28 : 0);
  const baseXP = 310;
  const currentXP = baseXP + earnedXP;
  const milestoneMax = 500;
  const milestoneProgressPercentage = Math.min(100, Math.round((currentXP / milestoneMax) * 100));

  const toggleHydration = (index: number) => {
    // Click on circle: if clicking the current progress level, decrease it; otherwise set to index + 1
    if (hydrationProgress === index + 1) {
      setHydrationProgress(index);
    } else {
      setHydrationProgress(index + 1);
    }
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

        {/* Hero */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>Hello, {user.name || 'Architect'}.</h1>
            <p>Your momentum is your legacy. You've completed {orbitPercentage}% of your targets this week.</p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-value purple">{stats.dayStreak}</div>
              <div className="stat-label">DAY STREAK</div>
            </div>
            <div className="stat-card">
              <div className="stat-value blue">{stats.dailyAvg}</div>
              <div className="stat-label">DAILY AVG</div>
            </div>
          </div>
        </div>

        <div className="grid-layout">
          {/* Left Column */}
          <div className="column-left" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Today's Pulse */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Today's Pulse</h2>
                <Link to="/habits" className="section-link">View Schedule &rarr;</Link>
              </div>
              <div className="task-list">
                
                <div className="task-card">
                  <div className="task-icon blue">
                    <Droplet size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Deep Hydration</h3>
                    <div className="task-meta">Target: 3.5 Liters • <span className={hydrationProgress === 3 ? "green" : "blue"}>{hydrationProgress === 3 ? 'Completed' : 'Progressing'}</span></div>
                  </div>
                  <div className="task-progress">
                    {[0, 1, 2].map(index => (
                      <div 
                        key={index}
                        onClick={() => toggleHydration(index)}
                        className={`progress-circle ${hydrationProgress > index ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {hydrationProgress > index && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="task-card">
                  <div className="task-icon purple">
                    <Activity size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Morning Meditation</h3>
                    <div className="task-meta">Target: 20 Minutes • <span className={meditationDone ? "green" : ""}>{meditationDone ? 'Completed' : 'Upcoming'}</span></div>
                  </div>
                  <div className="task-progress">
                    <div 
                      onClick={() => setMeditationDone(!meditationDone)}
                      className={`progress-circle ${meditationDone ? 'completed' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {meditationDone && <Check size={16} />}
                    </div>
                  </div>
                </div>

                <div className="task-card">
                  <div className="task-icon red">
                    <Dumbbell size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Weight Training</h3>
                    <div className="task-meta">Target: Upper Body • <span className={weightDone ? "green" : ""}>{weightDone ? 'Completed' : 'Upcoming'}</span></div>
                  </div>
                  <div className="task-progress">
                    <div 
                      onClick={() => setWeightDone(!weightDone)}
                      className={`progress-circle ${weightDone ? 'completed' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {weightDone && <Check size={16} />}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Unlocked Potential */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Unlocked Potential</h2>
              </div>
              <div className="potential-grid">
                
                <div className="potential-card">
                  <div className="potential-icon green">
                    <Star size={32} />
                  </div>
                  <h3 className="potential-title">Consistent Sage</h3>
                  <div className="potential-desc">7 DAY STREAK HIT</div>
                </div>

                <div className="potential-card">
                  <div className="potential-icon blue">
                    <Flame size={32} />
                  </div>
                  <h3 className="potential-title">Velocity Master</h3>
                  <div className="potential-desc">COMPLETED 10 TASKS</div>
                </div>

                <div className="potential-card">
                  <div className="potential-icon locked">
                    <Lock size={32} />
                  </div>
                  <h3 className="potential-title potential-locked">Zen Voyager</h3>
                  <div className="potential-desc">REACH LEVEL 30</div>
                </div>

                <div className="potential-card">
                  <div className="potential-icon locked">
                    <Lock size={32} />
                  </div>
                  <h3 className="potential-title potential-locked">Iron Will</h3>
                  <div className="potential-desc">30 DAY WEIGHT LOG</div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="column-right" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Daily Orbit */}
            <div className="orbit-card">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Daily Orbit</h2>
              <div 
                className="orbit-circle"
                style={{ background: `conic-gradient(#38bdf8 0%, #a855f7 ${orbitPercentage}%, #27272a ${orbitPercentage}%)` }}
              >
                <div className="orbit-inner">
                  <div className="orbit-value">{orbitPercentage}%</div>
                  <div className="orbit-label">OVERALL</div>
                </div>
              </div>
              <div className="orbit-stats">
                <div className="orbit-stat">
                  <div className="orbit-stat-label">Focus</div>
                  <div className="orbit-stat-value">{stats.focusTime}</div>
                </div>
                <div className="orbit-stat">
                  <div className="orbit-stat-label">Energy</div>
                  <div className="orbit-stat-value purple">{stats.energyLevel}</div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="quote-card">
              <div className="quote-marks">"</div>
              <p className="quote-text">
                "Excellence is not an act, but a habit. We are what we repeatedly do."
              </p>
              <div className="quote-author">— Aristotle</div>
            </div>

            {/* Today's Gains */}
            <div className="gains-card">
              <div className="gains-header">
                <h2 className="gains-title">Today's Gains</h2>
                <div className="gains-badge">+{earnedXP} XP</div>
              </div>
              <div className="gains-progress">
                <div className="gains-icon">
                  <Sparkles size={20} />
                </div>
                <div className="progress-bar-container">
                  <div className="progress-info">
                    <span>Milestone Progress</span>
                    <span>{currentXP}/{milestoneMax}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${milestoneProgressPercentage}%`, transition: 'width 0.3s ease-out' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
