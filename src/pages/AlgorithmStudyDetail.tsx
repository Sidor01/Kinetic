import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, BarChart2, Trophy, Settings,
    Bell, Zap, ArrowLeft, Brain, Edit3, Medal, CheckCircle2, Code2
} from 'lucide-react';
import LogImmersionModal from '../components/LogImmersionModal';
import './Dashboard.css';
import './HabitDetail.css';

interface User {
    id?: string;
    name?: string;
    email: string;
}

export default function AlgorithmStudyDetail() {
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

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const [matrixData] = useState(() => {
        const data: string[][] = [];
        for (let r = 0; r < 7; r++) {
            const row: string[] = [];
            for (let c = 0; c < 14; c++) {
                let cls = 'l0';
                const rnd = Math.random();
                if (rnd > 0.85) cls = 'l4';
                else if (rnd > 0.65) cls = 'l3';
                else if (rnd > 0.35) cls = 'l2';
                else if (rnd > 0.15) cls = 'l1';
                if (c === 13 && r > 4) cls = 'l0';
                row.push(cls);
            }
            data.push(row);
        }
        return data;
    });

    const [trendPeriod, setTrendPeriod] = useState<14 | 30>(14);
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showImmersionModal, setShowImmersionModal] = useState(false);

    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [notes, setNotes] = useState([
        { id: 1, date: 'Yesterday, 10:30 PM', text: 'Finally cracked the knapsack problem variant. Key insight: thinking in terms of state transitions instead of "choices" makes DP click.' },
        { id: 2, date: '2 days ago', text: 'Struggled with graph traversal edge cases. BFS vs DFS trade-offs are clearer now after the maze problem set.' },
        { id: 3, date: 'Oct 15', text: '20-day milestone! Solved 5 medium LeetCode problems this week. Pattern recognition is getting stronger.' },
        { id: 4, date: 'Oct 08', text: 'Reviewed sliding window patterns. Two-pointer technique saves so much time on array problems.' },
        { id: 5, date: 'Sept 30', text: 'Started the binary search deep-dive. These problems always trip me up but getting better.' }
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

    const trendDays14 = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const trendHeights14 = [50, 70, 40, 60, 80, 30, 20, 60, 90, 50, 70, 80, 25, 60];

    const trendDays30 = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T'];
    const trendHeights30 = [50, 70, 40, 60, 80, 30, 20, 60, 90, 50, 70, 80, 25, 60, 50, 70, 40, 60, 80, 30, 20, 60, 90, 50, 70, 80, 25, 60, 50, 70];

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
                            <h1>Algorithm Study</h1>
                            <p>Mastering dynamic programming and data structures.</p>
                        </div>
                        <button
                            className={`hd-complete-btn ${isCompleted ? 'completed' : ''}`}
                            style={!isCompleted ? { background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' } : {}}
                            onClick={() => {
                                if (!isCompleted) {
                                    setShowImmersionModal(true);
                                }
                            }}
                        >
                            {isCompleted ? <><CheckCircle2 size={16} /> Session Completed</> : 'Start Session'}
                        </button>
                    </div>

                    <div className="hd-grid-top">

                        {/* Momentum Card */}
                        <div className="hd-card hd-card-momentum">
                            <h3 className="hd-card-title">CURRENT MOMENTUM</h3>

                            <div className="hd-ring-container">
                                <svg width="160" height="160" viewBox="0 0 160 160">
                                    <defs>
                                        <linearGradient id="ring-grad-algo" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="80" cy="80" r="72" fill="none" stroke="#27272a" strokeWidth="6" />
                                    {/* Progress ~60% */}
                                    <circle cx="80" cy="80" r="72" fill="none" stroke="url(#ring-grad-algo)" strokeWidth="6" strokeDasharray="452" strokeDashoffset="181" strokeLinecap="round" transform="rotate(-90 80 80)" />
                                </svg>
                                <div className="hd-ring-text">
                                    <h2 style={{ fontSize: '48px', background: 'linear-gradient(180deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {isCompleted ? 19 : 18}
                                    </h2>
                                    <p style={{ fontSize: '11px', color: '#60a5fa' }}>Day Streak</p>
                                    <Brain size={16} className="hd-heart-icon" style={isCompleted ? { color: '#06b6d4' } : { color: '#a1a1aa' }} />
                                </div>
                            </div>

                            <div className="hd-reward-box">
                                <div className="hd-reward-top">
                                    <span>Next Reward</span>
                                    <span style={{ color: '#3b82f6' }}>60%</span>
                                </div>
                                <div className="hd-progress-bar-bg">
                                    <div className="hd-progress-bar-fill" style={{ width: '60%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}></div>
                                </div>
                                <div className="hd-reward-bottom">
                                    12 DAYS REMAINING FOR "CODE SENSEI" BADGE
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
                                    <div className="hd-legend-box l1" style={{ background: '#1d4ed8' }}></div>
                                    <div className="hd-legend-box l3" style={{ background: '#3b82f6' }}></div>
                                    <div className="hd-legend-box l4" style={{ background: '#06b6d4' }}></div>
                                    MORE
                                </div>
                            </div>

                            <div className="hd-matrix-grid">
                                {days.map((day, rowIndex) => (
                                    <div key={day} style={{ display: 'contents' }}>
                                        <div className="hd-matrix-day">{day}</div>
                                        {matrixData[rowIndex].map((cls, colIndex) => (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className={`hd-matrix-box ${cls}`}
                                                style={
                                                    cls === 'l1' ? { background: '#1d4ed8' } :
                                                        cls === 'l2' ? { background: '#2563eb' } :
                                                            cls === 'l3' ? { background: '#3b82f6' } :
                                                                cls === 'l4' ? { background: '#06b6d4' } : {}
                                                }
                                            ></div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className="hd-matrix-stats">
                                <div className="hd-stat-group">
                                    <h4>247</h4>
                                    <p>PROBLEMS SOLVED</p>
                                </div>
                                <div className="hd-stat-group">
                                    <h4>48h</h4>
                                    <p>DEEP FOCUS</p>
                                </div>
                                <div className="hd-stat-right">
                                    Last updated: Today, 11:15 PM
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="hd-grid-mid">

                        {/* Trends Card */}
                        <div className="hd-card hd-card-trends">
                            <div className="hd-trends-header">
                                <div className="hd-trends-title">
                                    <h3>Problems Solved Trends</h3>
                                    <p>Number of problems per session over the last {trendPeriod} days</p>
                                </div>
                                <div className="hd-trends-toggle">
                                    <button className={trendPeriod === 14 ? "active" : ""} onClick={() => setTrendPeriod(14)}>14D</button>
                                    <button className={trendPeriod === 30 ? "active" : ""} onClick={() => setTrendPeriod(30)}>30D</button>
                                </div>
                            </div>

                            <div className="hd-trends-chart">
                                {trendHeights.map((h, i) => (
                                    <div key={i} className="hd-trend-bar-wrapper" style={{ width: trendPeriod === 30 ? '10px' : '14px', gap: trendPeriod === 30 ? '4px' : '6px' }}>
                                        <div
                                            className={`hd-trend-bar ${h > 70 ? 'highlight' : h < 30 ? 'low' : ''}`}
                                            style={{
                                                height: `${h}%`,
                                                width: trendPeriod === 30 ? '6px' : '10px',
                                                background: h > 70 ? 'linear-gradient(180deg, #06b6d4, #3b82f6)' : h < 30 ? '#27272a' : '#1d4ed8'
                                            }}
                                        ></div>
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
                                    style={{ background: 'none', border: 'none', color: isAddingNote ? '#3b82f6' : '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
                                            placeholder="What did you study today?"
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
                                            <button className="hd-save-btn" style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }} onClick={handleAddNote}>Save</button>
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
                                {showAllNotes ? 'Collapse Notes' : 'View All Notes'}
                            </button>
                        </div>
                    </div>

                    {/* Difficulty Breakdown Card */}
                    <div className="hd-grid-mid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <div className="hd-card" style={{ textAlign: 'center' }}>
                            <Code2 size={28} style={{ color: '#4ade80', marginBottom: '12px' }} />
                            <h4 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0', color: '#4ade80' }}>124</h4>
                            <p style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Easy Solved</p>
                        </div>
                        <div className="hd-card" style={{ textAlign: 'center' }}>
                            <Code2 size={28} style={{ color: '#f59e0b', marginBottom: '12px' }} />
                            <h4 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0', color: '#f59e0b' }}>98</h4>
                            <p style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Medium Solved</p>
                        </div>
                        <div className="hd-card" style={{ textAlign: 'center' }}>
                            <Code2 size={28} style={{ color: '#ef4444', marginBottom: '12px' }} />
                            <h4 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0', color: '#ef4444' }}>25</h4>
                            <p style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Hard Solved</p>
                        </div>
                    </div>

                    <div className="hd-card hd-achievement">
                        <div className="hd-ach-badge" style={{ background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)' }}>
                            <Medal size={32} className="hd-ach-icon" style={{ color: '#60a5fa' }} />
                        </div>
                        <div className="hd-ach-info">
                            <h3>Code Sensei Achievement</h3>
                            <p className="hd-ach-desc">
                                Complete 30 consecutive days of algorithm study <strong>18 / 30</strong>
                            </p>
                            <div className="hd-ach-bar-bg">
                                <div className="hd-ach-bar-fill" style={{ width: '60%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}></div>
                            </div>
                        </div>
                        <div className="hd-ach-reward">
                            <div className="hd-ach-reward-lbl">REWARD VALUE</div>
                            <div className="hd-ach-reward-val" style={{ color: '#60a5fa' }}>+4,000 XP</div>
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
                    defaultDuration={60}
                />
            )}
        </div>
    );
}
