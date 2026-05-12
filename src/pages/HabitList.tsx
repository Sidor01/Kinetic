import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Trophy,
  Settings,
  Bell,
  Zap,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Check,
  MoreVertical,
  Droplet,
  Plus,
  ChevronDown,
  X,
  Edit,
  Sparkles,
  Heart,
  BookOpen,
  Flower2,
  Grid,
  BadgeCheck
} from 'lucide-react';
import './Dashboard.css';
import './HabitList.css';

interface User {
  id?: string;
  name?: string;
  email: string;
}

export default function HabitList() {
  const navigate = useNavigate();
  const [user] = useState<User | null>(() => {
    const userStr = localStorage.getItem('kinetic_currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  });

  const [plungeDone, setPlungeDone] = useState(true);
  const [studyDone, setStudyDone] = useState(false);
  const [hydrationDone, setHydrationDone] = useState(false);
  const [activeTab, setActiveTab] = useState('All Habits');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ritualInput, setRitualInput] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState('Health');

  const allSuggestions = [
    { name: "Morning Meditation", category: "Mindfulness" },
    { name: "Read 20 Pages", category: "Learning" },
    { name: "Hydrate (2L)", category: "Health" },
    { name: "Evening Reflection", category: "Mindfulness" },
    { name: "6am Cold Plunge", category: "Health" },
    { name: "Algorithm Study", category: "Learning" },
    { name: "Deep Work", category: "Productivity" },
    { name: "Mindful Breathing", category: "Mindfulness" },
    { name: "Stretch / Yoga", category: "Health" }
  ];
  
  const filteredSuggestions = ritualInput.trim() === '' 
    ? allSuggestions.filter(s => s.category === selectedArchetype).slice(0, 4) 
    : allSuggestions.filter(s => s.name.toLowerCase().includes(ritualInput.toLowerCase())).slice(0, 4);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

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

        {/* Habit List specific content */}
        <div className="hl-header">
          <h1>The Ritual <span className="purple">Stack</span></h1>
          <div className="hl-header-row">
            <p className="hl-subtitle">
              Designing your reality through consistent, intentional movement.<br/>
              You have 4 tasks remaining for today's optimal performance cycle.
            </p>
            <div className="hl-controls">
              <button 
                className="hl-btn-control"
                onClick={() => {
                  const nextPrio = priorityFilter === 'All' ? 'High' : priorityFilter === 'High' ? 'Medium' : priorityFilter === 'Medium' ? 'Low' : 'All';
                  setPriorityFilter(nextPrio);
                }}
              >
                <ArrowUpDown size={16} /> Priority {priorityFilter !== 'All' ? `: ${priorityFilter}` : ''}
              </button>
            </div>
          </div>
        </div>

        <div className="hl-tabs">
          {['All Habits', 'Health', 'Productivity', 'Learning', 'Mindfulness'].map(tab => (
            <button 
              key={tab}
              className={`hl-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="hl-grid">
          
          {/* Card 1: 6am Cold Plunge (Large) - High Priority */}
          {(activeTab === 'All Habits' || activeTab === 'Health') && (priorityFilter === 'All' || priorityFilter === 'High') && (
          <div className="hl-card large">
            <span className="hl-card-tag tag-health">HEALTH</span>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              6am Cold Plunge
            </h3>
            
            <div className="hl-progress-circle-wrap">
              <div className="hl-circle"><span>85%</span></div>
              <div className="hl-streak">12 DAY STREAK</div>
            </div>

            <div className="hl-card-meta">
              <span>🕒 Daily</span>
              <span>⚡ High Difficulty</span>
            </div>

            <div className="hl-large-bottom">
              <div className="hl-days">
                <div className="hl-day active">M</div>
                <div className="hl-day active">T</div>
                <div className="hl-day active">W</div>
                <div className="hl-day">T</div>
                <div className="hl-day">F</div>
              </div>
              <button 
                className={plungeDone ? "hl-btn-done" : "hl-btn-not-done"} 
                onClick={() => setPlungeDone(!plungeDone)}
                style={!plungeDone ? { width: 'auto', marginTop: 0 } : undefined}
              >
                <CheckCircle2 size={20} strokeWidth={2.5} /> {plungeDone ? 'Mark Done' : 'Not Done'}
              </button>
            </div>
          </div>
          )}

          {/* Card 2: Algorithm Study - Medium Priority */}
          {(activeTab === 'All Habits' || activeTab === 'Learning') && (priorityFilter === 'All' || priorityFilter === 'Medium') && (
          <div className="hl-card">
            <span className="hl-card-tag tag-learning">LEARNING</span>
            <h3>Algorithm Study</h3>
            <p>Mastering dynamic programming structures.</p>
            
            <div className="hl-small-meta">
              <div className="hl-meta-row">
                <span>DIFFICULTY</span>
                <span className="blue">Medium</span>
              </div>
              <div className="hl-meta-row">
                <span>FREQUENCY</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>3x Week</span>
              </div>
            </div>

            <button 
              className={studyDone ? "hl-btn-done" : "hl-btn-not-done"} 
              onClick={() => setStudyDone(!studyDone)}
              style={studyDone ? { width: '100%', marginTop: '24px', justifyContent: 'center' } : undefined}
            >
              <CheckCircle2 size={16} strokeWidth={2.5} /> {studyDone ? 'Mark Done' : 'Not Done'}
            </button>
          </div>
          )}

          {/* Card 3: Deep Work - High Priority */}
          {(activeTab === 'All Habits' || activeTab === 'Productivity') && (priorityFilter === 'All' || priorityFilter === 'High') && (
          <div className="hl-card">
            <span className="hl-card-tag tag-productivity">PRODUCTIVITY</span>
            <div className="hl-icon-top-right" style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={16} color="#18181b" strokeWidth={3} />
            </div>
            
            <h3>Deep Work</h3>
            <p>90 minutes of focused output.</p>

            <div className="hl-status-box">
              <div>
                <div className="hl-status-label">STATUS</div>
                <div className="hl-status-val">Completed Today</div>
              </div>
              <div className="hl-status-num">01</div>
            </div>
          </div>
          )}

          {/* Card 4: Evening Reflection - Low Priority */}
          {(activeTab === 'All Habits' || activeTab === 'Mindfulness') && (priorityFilter === 'All' || priorityFilter === 'Low') && (
          <div className="hl-card hl-card-glow">
            <span className="hl-card-tag tag-mindfulness">MINDFULNESS</span>
            <h3>Evening Reflection</h3>
            <p>Gratitude and tomorrow's intent.</p>

            <div className="hl-progress-line-wrap">
              <div className="hl-progress-line"><div className="hl-progress-line-fill"></div></div>
              <div className="hl-progress-text">2/7 DAYS</div>
            </div>
          </div>
          )}

          {/* Card 5: Hydration Goal - Low Priority */}
          {(activeTab === 'All Habits' || activeTab === 'Health') && (priorityFilter === 'All' || priorityFilter === 'Low') && (
          <div className="hl-card" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="hl-center-content">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="hl-icon-circle">
                  <Droplet size={24} />
                </div>
                <div className="hl-center-text">
                  <h3 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>Hydration Goal</h3>
                  <p style={{ margin: 0 }}>3.5L Intake</p>
                </div>
              </div>
              <button 
                className="hl-btn-plus"
                onClick={() => setHydrationDone(!hydrationDone)}
                style={hydrationDone ? { backgroundColor: '#bbf7d0', color: '#166534' } : undefined}
              >
                {hydrationDone ? <Check size={20} strokeWidth={2.5} /> : <Plus size={20} />}
              </button>
            </div>
          </div>
          )}

        </div>

        <div className="hl-footer">
          <div className="hl-dots">
            <div className="hl-dot active"></div>
            <div className="hl-dot"></div>
            <div className="hl-dot"></div>
          </div>
          <button className="hl-archived">
            Show archived habits <ChevronDown size={14} />
          </button>
        </div>

        <button className="hl-fab" onClick={() => setIsModalOpen(true)}>
          <Plus size={32} color="#1a1a1a" />
        </button>

        {isModalOpen && (
          <div className="hl-modal-overlay">
            <div className="hl-modal">
              <button className="hl-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={16} />
              </button>
              
              <div className="hl-modal-header">
                <h2>Define Your Ritual</h2>
                <p>Establish the parameters of your new habit.</p>
              </div>

              <div className="hl-modal-section">
                <label className="hl-modal-label">RITUAL DESIGNATION</label>
                <div className="hl-input-wrapper">
                  <Edit size={16} className="modal-icon" />
                  <input 
                    type="text" 
                    placeholder="e.g., Morning Meditation" 
                    value={ritualInput}
                    onChange={(e) => setRitualInput(e.target.value)}
                  />
                </div>
                
                {filteredSuggestions.length > 0 && (
                  <div className="hl-suggestions">
                    <label className="hl-modal-label dim" style={{ marginBottom: '8px' }}>SUGGESTED RITUALS</label>
                    {filteredSuggestions.map((sug) => (
                      <div 
                        key={sug.name} 
                        className="hl-suggestion-item"
                        onClick={() => {
                          setRitualInput(sug.name);
                          setSelectedArchetype(sug.category);
                        }}
                      >
                        <Sparkles size={14} className="modal-icon" /> {sug.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hl-modal-section">
                <label className="hl-modal-label">ARCHETYPE</label>
                <div className="hl-archetype-grid">
                  <button className={`hl-archetype-btn ${selectedArchetype === 'Health' ? 'active' : ''}`} onClick={() => setSelectedArchetype('Health')}><Heart size={16} className="modal-icon" /> Health</button>
                  <button className={`hl-archetype-btn ${selectedArchetype === 'Productivity' ? 'active' : ''}`} onClick={() => setSelectedArchetype('Productivity')}><Zap size={16} className="modal-icon" /> Productivity</button>
                  <button className={`hl-archetype-btn ${selectedArchetype === 'Learning' ? 'active' : ''}`} onClick={() => setSelectedArchetype('Learning')}><BookOpen size={16} className="modal-icon" /> Learning</button>
                  <button className={`hl-archetype-btn ${selectedArchetype === 'Mindfulness' ? 'active' : ''}`} onClick={() => setSelectedArchetype('Mindfulness')}><Flower2 size={16} className="modal-icon" /> Mindfulness</button>
                  <button className={`hl-archetype-btn ${selectedArchetype === 'Other' ? 'active' : ''}`} onClick={() => setSelectedArchetype('Other')}><Grid size={16} className="modal-icon" /> Other</button>
                </div>
              </div>

              <button 
                className="hl-submit-btn"
                onClick={() => {
                  setRitualInput('');
                  setSelectedArchetype('Health');
                  setIsModalOpen(false);
                }}
              >
                Seal Ritual <BadgeCheck size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
