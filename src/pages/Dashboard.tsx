import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  Check,
  Dumbbell,
  Sparkles,
  Star,
  Flame,
  Lock,
  Activity,
  BookOpen,
  Heart,
  Zap
} from 'lucide-react';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

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
  const [readDone, setReadDone] = useState(() => {
    const saved = localStorage.getItem('kinetic_read');
    return saved ? JSON.parse(saved) : false;
  });
  const [noSugarDone, setNoSugarDone] = useState(() => {
    const saved = localStorage.getItem('kinetic_nosugar');
    return saved ? JSON.parse(saved) : false;
  });
  const [stats] = useState(() => {
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
    localStorage.setItem('kinetic_read', JSON.stringify(readDone));
    localStorage.setItem('kinetic_nosugar', JSON.stringify(noSugarDone));
    localStorage.setItem('kinetic_stats', JSON.stringify(stats));
  }, [hydrationProgress, meditationDone, weightDone, readDone, noSugarDone, stats]);


  const completedTasksCount = hydrationProgress + (meditationDone ? 1 : 0) + 
(weightDone ? 1 : 0) + (readDone ? 1 : 0) + (noSugarDone ? 1 : 0);
  const totalTasksCount = 5;
  const orbitPercentage = Math.round((completedTasksCount / totalTasksCount) * 
100);

  const earnedXP = (hydrationProgress * 28) + (meditationDone ? 28 : 0) + 
(weightDone ? 28 : 0) + (readDone ? 28 : 0) + (noSugarDone ? 28 : 0);
  const baseXP = 310;
  const currentXP = baseXP + earnedXP;
  const milestoneMax = 500;
  const milestoneProgressPercentage = Math.min(100, Math.round((currentXP / 
milestoneMax) * 100));

  const toggleHydration = (index: number) => {
    if (hydrationProgress === index + 1) {
      setHydrationProgress(index);
    } else {
      setHydrationProgress(index + 1);
    }
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />

      {/* Main Content */}
      <div className="dashboard-main">
        <AppHeader />

        {/* Hero */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 style={{ color: '#ffffff' }}>Hello, {user?.displayName || 'Architect'}.</h1>
            <p>Your momentum is your legacy. You've completed {orbitPercentage}%
 of your targets this week.</p>
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
          <div className="column-left" style={{ display: 'flex', flexDirection: 
'column', gap: '48px' }}>

            {/* Today's Pulse */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Today's Pulse</h2>
                <Link to="/habits" className="section-link">View Schedule 
&rarr;</Link>
              </div>
              <div className="task-list">

                <div className="task-card">
                  <div className="task-icon blue">
                    <Activity size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Morning Run</h3>
                    <div className="task-meta">Target: 5km • <span 
className={hydrationProgress === 3 ? "green" : "blue"}>{hydrationProgress === 3 
? 'Completed' : 'Progressing'}</span></div>
                  </div>
                  <div className="task-progress">
                    {[0, 1, 2].map(index => (
                      <div
                        key={index}
                        onClick={() => toggleHydration(index)}
                        className={`progress-circle ${hydrationProgress > index 
? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {hydrationProgress > index && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="task-card">
                  <div className="task-icon purple">
                    <Sparkles size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Meditation</h3>
                    <div className="task-meta">Target: 20 Minutes • <span 
className={meditationDone ? "green" : ""}>{meditationDone ? 'Completed' : 
'Upcoming'}</span></div>
                  </div>
                  <div className="task-progress">
                    <div
                      onClick={() => setMeditationDone(!meditationDone)}
                      className={`progress-circle ${meditationDone ? 'completed'
 : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {meditationDone && <Check size={16} />}
                    </div>
                  </div>
                </div>

                <div className="task-card">
                  <div className="task-icon red">
                    <Zap size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Code 1h</h3>
                    <div className="task-meta">Target: Deep Work • <span 
className={weightDone ? "green" : ""}>{weightDone ? 'Completed' : 
'Upcoming'}</span></div>
                  </div>
                  <div className="task-progress">
                    <div
                      onClick={() => setWeightDone(!weightDone)}
                      className={`progress-circle ${weightDone ? 'completed' : 
''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {weightDone && <Check size={16} />}
                    </div>
                  </div>
                </div>

                <div className="task-card">
                  <div className="task-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7)' }}>
                    <BookOpen size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">Read 10 Pages</h3>
                    <div className="task-meta">Target: Daily Reading • <span className={readDone ? "green" : ""}>{readDone ? 'Completed' : 'Upcoming'}</span></div>
                  </div>
                  <div className="task-progress">
                    <div
                      onClick={() => setReadDone(!readDone)}
                      className={`progress-circle ${readDone ? 'completed' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {readDone && <Check size={16} />}
                    </div>
                  </div>
                </div>

                <div className="task-card">
                  <div className="task-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
                    <Heart size={24} />
                  </div>
                  <div className="task-details">
                    <h3 className="task-name">No Sugar</h3>
                    <div className="task-meta">Target: Zero Sugar • <span className={noSugarDone ? "green" : ""}>{noSugarDone ? 'Completed' : 'Upcoming'}</span></div>
                  </div>
                  <div className="task-progress">
                    <div
                      onClick={() => setNoSugarDone(!noSugarDone)}
                      className={`progress-circle ${noSugarDone ? 'completed' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {noSugarDone && <Check size={16} />}
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
                  <h3 className="potential-title potential-locked">Zen 
Voyager</h3>
                  <div className="potential-desc">REACH LEVEL 30</div>
                </div>

                <div className="potential-card">
                  <div className="potential-icon locked">
                    <Lock size={32} />
                  </div>
                  <h3 className="potential-title potential-locked">Iron 
Will</h3>
                  <div className="potential-desc">30 DAY WEIGHT LOG</div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="column-right" style={{ display: 'flex', flexDirection:
 'column', gap: '32px' }}>

            {/* Daily Orbit */}
            <div className="orbit-card">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Daily 
Orbit</h2>
              <div
                className="orbit-circle"
                style={{ background: `conic-gradient(#38bdf8 0%, #a855f7 
${orbitPercentage}%, #27272a ${orbitPercentage}%)` }}
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
                  <div className="orbit-stat-value 
purple">{stats.energyLevel}</div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="quote-card">
              <div className="quote-marks">"</div>
              <p className="quote-text">
                "Excellence is not an act, but a habit. We are what we 
repeatedly do."
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
                      style={{ width: `${milestoneProgressPercentage}%`, 
transition: 'width 0.3s ease-out' }}
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
