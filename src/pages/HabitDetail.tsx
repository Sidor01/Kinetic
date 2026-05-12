import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, BarChart2, Trophy, Settings,
  Bell, Zap, ArrowLeft, HeartPulse, Edit3, Medal, CheckCircle2
} from 'lucide-react';
import LogImmersionModal from '../components/LogImmersionModal';
import './Dashboard.css';
import './HabitDetail.css';

interface User {
  id?: string;
  name?: string;
  email: string;
}

export default function HabitDetail() {
  const navigate = useNavigate();
  const [user] = useState<User | null>(() => {
    const userStr = localStorage.getItem('kinetic_currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  });

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  // Generate Matrix Data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Create stable matrix data so it doesn't re-render on trend toggle
  const [matrixData] = useState(() => {
    const data: string[][] = [];
    for (let r = 0; r < 7; r++) {
      const row: string[] = [];
      for (let c = 0; c < 14; c++) {
        let cls = 'l0';
        const rnd = Math.random();
        if (rnd > 0.8) cls = 'l4';
        else if (rnd > 0.6) cls = 'l3';
        else if (rnd > 0.3) cls = 'l2';
        else if (rnd > 0.1) cls = 'l1';
        
        if (c === 13 && r > 3) cls = 'l0'; // empty future days
        row.push(cls);
      }
      data.push(row);
    }
    return data;
  });

  // State for interactive parts
  const [trendPeriod, setTrendPeriod] = useState<14 | 30>(14);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showImmersionModal, setShowImmersionModal] = useState(false);

  // Journal State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, date: 'Yesterday, 9:15 PM', text: 'Felt much more centered today. Focusing on the breath at the tip of the nose helps keep the mind from wandering.' },
    { id: 2, date: '3 days ago', text: 'Struggled with distractions today. Will try a guided session tomorrow morning instead of evening.' },
    { id: 3, date: 'Oct 12', text: 'Reached 30-day milestone! Mental clarity has noticeably improved during work hours.' },
    { id: 4, date: 'Oct 05', text: 'Skipped morning meditation but did a quick 5-min session before bed. Consistency is key.' },
    { id: 5, date: 'Sept 28', text: 'Feeling great. Today\'s session was extremely deep. The new breathing pattern works well.' }
  ]);

  const handleAddNote = () => {
    if (!newNoteText.trim()) {
      setIsAddingNote(false);
      return;
    }
    const newNote = {
      id: Date.now(),
      date: 'Just now',
      text: newNoteText.trim()
    };
    setNotes([newNote, ...notes]);
    setNewNoteText('');
    setIsAddingNote(false);
  };

  // Trends Data
  const trendDays14 = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const trendHeights14 = [40, 60, 30, 70, 50, 40, 20, 80, 50, 60, 60, 60, 20, 50];

  const trendDays30 = ['M','T','W','T','F','S','S','M','T','W','T','F','S','S','M','T','W','T','F','S','S','M','T','W','T','F','S','S','M','T'];
  const trendHeights30 = [40, 60, 30, 70, 50, 40, 20, 80, 50, 60, 60, 60, 20, 50, 40, 60, 30, 70, 50, 40, 20, 80, 50, 60, 60, 60, 20, 50, 40, 60];

  const trendDays = trendPeriod === 14 ? trendDays14 : trendDays30;
  const trendHeights = trendPeriod === 14 ? trendHeights14 : trendHeights30;

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

        <div className="user-profile" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
          <div className="user-avatar">👨‍💼</div>
          <div className="user-info">
            <span className="user-level">Level 24</span>
            <span className="user-title">Master Architect</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top bar */}
        <div className="header-top" style={{ padding: '0 40px', marginTop: '16px', marginBottom: '8px' }}>
          <Bell size={24} color="#a1a1aa" />
          <div className="pts-badge">
            <Zap size={16} fill="currentColor" />
            1,250 PTS
          </div>
        </div>

        <div className="hd-wrapper">
          <button className="hd-back-link" onClick={() => navigate('/habits')} style={{ background: 'none', border: 'none' }}>
            <ArrowLeft size={12} /> BACK TO OVERVIEW
          </button>

          <div className="hd-header">
            <div className="hd-title">
              <h1>Daily Meditation</h1>
              <p>Mindfulness and mental clarity session.</p>
            </div>
            <button 
              className={`hd-complete-btn ${isCompleted ? 'completed' : ''}`}
              onClick={() => {
                if (!isCompleted) {
                  setShowImmersionModal(true);
                }
              }}
            >
              {isCompleted ? <><CheckCircle2 size={16} /> Session Completed</> : "Complete Session"}
            </button>
          </div>

          <div className="hd-grid-top">
            
            {/* Momentum Card */}
            <div className="hd-card hd-card-momentum">
              <h3 className="hd-card-title">CURRENT MOMENTUM</h3>
              
              <div className="hd-ring-container">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#875afb" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                  {/* Background Circle */}
                  <circle cx="80" cy="80" r="72" fill="none" stroke="#27272a" strokeWidth="6" />
                  {/* Progress Circle (approx 85%) */}
                  <circle cx="80" cy="80" r="72" fill="none" stroke="url(#ring-grad)" strokeWidth="6" strokeDasharray="452" strokeDashoffset="68" strokeLinecap="round" transform="rotate(-90 80 80)" />
                </svg>
                <div className="hd-ring-text">
                  <h2 style={{ fontSize: '48px' }}>{isCompleted ? 43 : 42}</h2>
                  <p style={{ fontSize: '11px' }}>Day Streak</p>
                  <HeartPulse size={16} className="hd-heart-icon" style={isCompleted ? { color: '#4ade80' } : {}} />
                </div>
              </div>

              <div className="hd-reward-box">
                <div className="hd-reward-top">
                  <span>Next Reward</span>
                  <span>85%</span>
                </div>
                <div className="hd-progress-bar-bg">
                  <div className="hd-progress-bar-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="hd-reward-bottom">
                  8 DAYS REMAINING FOR "ZEN MASTER" BADGE
                </div>
              </div>
            </div>

            {/* Matrix Card */}
            <div className="hd-card hd-card-matrix">
              <div className="hd-matrix-header">
                <h3>Consistency Matrix</h3>
                <div className="hd-legend">
                  LESS
                  <div className="hd-legend-box l0"></div>
                  <div className="hd-legend-box l1"></div>
                  <div className="hd-legend-box l3"></div>
                  <div className="hd-legend-box l4"></div>
                  MORE
                </div>
              </div>

              <div className="hd-matrix-grid">
                {days.map((day, rowIndex) => (
                  <div key={day} style={{ display: 'contents' }}>
                    <div className="hd-matrix-day">{day}</div>
                    {matrixData[rowIndex].map((cls, colIndex) => (
                      <div key={`${rowIndex}-${colIndex}`} className={`hd-matrix-box ${cls}`}></div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="hd-matrix-stats">
                <div className="hd-stat-group">
                  <h4>142</h4>
                  <p>TOTAL SITTINGS</p>
                </div>
                <div className="hd-stat-group">
                  <h4>15.5h</h4>
                  <p>DEEP FOCUS</p>
                </div>
                <div className="hd-stat-right">
                  Last updated: Today, 8:42 AM
                </div>
              </div>
            </div>

          </div>

          <div className="hd-grid-mid">
            
            {/* Trends Card */}
            <div className="hd-card hd-card-trends">
              <div className="hd-trends-header">
                <div className="hd-trends-title">
                  <h3>Session Duration Trends</h3>
                  <p>Minutes per session over the last {trendPeriod} days</p>
                </div>
                <div className="hd-trends-toggle">
                  <button className={trendPeriod === 14 ? "active" : ""} onClick={() => setTrendPeriod(14)}>14D</button>
                  <button className={trendPeriod === 30 ? "active" : ""} onClick={() => setTrendPeriod(30)}>30D</button>
                </div>
              </div>

              <div className="hd-trends-chart">
                {trendHeights.map((h, i) => (
                  <div key={i} className="hd-trend-bar-wrapper" style={{ width: trendPeriod === 30 ? '10px' : '14px', gap: trendPeriod === 30 ? '4px' : '6px' }}>
                    <div className={`hd-trend-bar ${h > 70 ? 'highlight' : h < 30 ? 'low' : ''}`} style={{ height: `${h}%`, width: trendPeriod === 30 ? '6px' : '10px' }}></div>
                    <div className="hd-trend-day" style={{ fontSize: trendPeriod === 30 ? '8px' : '9px' }}>{trendDays[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journal Card */}
            <div className="hd-card hd-card-journal">
              <div className="hd-journal-header">
                <h3>Journal</h3>
                <button 
                  style={{ background: 'none', border: 'none', color: isAddingNote ? '#a855f7' : '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
                  onClick={() => setIsAddingNote(!isAddingNote)}
                >
                  <Edit3 size={16} className="hd-journal-icon" />
                </button>
              </div>
              
              <div className="hd-journal-list">
                {isAddingNote && (
                  <div className="hd-journal-entry hd-add-note">
                    <textarea 
                      autoFocus
                      placeholder="How did your session go?" 
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddNote();
                        }
                      }}
                    />
                    <div className="hd-add-note-actions">
                      <button className="hd-cancel-btn" onClick={() => setIsAddingNote(false)}>Cancel</button>
                      <button className="hd-save-btn" onClick={handleAddNote}>Save</button>
                    </div>
                  </div>
                )}

                {notes.slice(0, showAllNotes ? notes.length : 3).map(note => (
                  <div key={note.id} className="hd-journal-entry">
                    <span className="hd-journal-date">{note.date}</span>
                    <p>{note.text}</p>
                  </div>
                ))}
              </div>

              <button className="hd-journal-btn" onClick={() => setShowAllNotes(!showAllNotes)}>
                {showAllNotes ? "Collapse Notes" : "View All Notes"}
              </button>
            </div>
          </div>

          <div className="hd-card hd-achievement">
            <div className="hd-ach-badge">
              <Medal size={32} className="hd-ach-icon" />
            </div>
            <div className="hd-ach-info">
              <h3>Zen Master Achievement</h3>
              <p className="hd-ach-desc">
                Complete 50 consecutive days of meditation <strong>42 / 50</strong>
              </p>
              <div className="hd-ach-bar-bg">
                <div className="hd-ach-bar-fill"></div>
              </div>
            </div>
            <div className="hd-ach-reward">
              <div className="hd-ach-reward-lbl">REWARD VALUE</div>
              <div className="hd-ach-reward-val">+5,000 XP</div>
            </div>
          </div>

        </div>
      </div>

      {showImmersionModal && (
        <LogImmersionModal 
          onClose={() => setShowImmersionModal(false)}
          onSeal={(data) => {
            setIsCompleted(true);
            setShowImmersionModal(false);
            if (data.notes.trim()) {
              setNotes([
                { id: Date.now(), date: 'Just now', text: data.notes },
                ...notes
              ]);
            }
          }}
          defaultDuration={15}
        />
      )}
    </div>
  );
}