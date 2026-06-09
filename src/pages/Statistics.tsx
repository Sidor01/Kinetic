import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import './Dashboard.css';
import { 
  TrendingUp, TrendingDown, Flame, Target, Zap, 
  CheckCircle2, X, ArrowRight, Calendar, Info,
  Circle
} from 'lucide-react';

const WEEKLY_DATA = [
  { day: 'Mon', completed: 4, total: 5 },
  { day: 'Tue', completed: 5, total: 5 },
  { day: 'Wed', completed: 3, total: 5 },
  { day: 'Thu', completed: 5, total: 5 },
  { day: 'Fri', completed: 2, total: 5 },
  { day: 'Sat', completed: 4, total: 5 },
  { day: 'Sun', completed: 5, total: 5 },
];

const HABITS = [
  { name: 'Morning Run', streak: 12, total: 45, completed: 40, color: '#ef4444' },
  { name: 'Read 10 Pages', streak: 8, total: 45, completed: 38, color: '#3b82f6' },
  { name: 'Meditation', streak: 5, total: 45, completed: 30, color: '#a855f7' },
  { name: 'No Sugar', streak: 3, total: 45, completed: 25, color: '#22c55e' },
  { name: 'Code 1h', streak: 15, total: 45, completed: 42, color: '#f59e0b' },
];

const POINTS_HISTORY = [
  { day: 'Mon', points: 120 },
  { day: 'Tue', points: 150 },
  { day: 'Wed', points: 90 },
  { day: 'Thu', points: 200 },
  { day: 'Fri', points: 180 },
  { day: 'Sat', points: 220 },
  { day: 'Sun', points: 250 },
];

const HEATMAP_LEVELS = [0,0,1,2,3,3,2,1,0,2,3,3,2,1,0,2,3,2,1,0,0,1,2,3,3,2,1,0,2,3,1,0,2,1,0];
const HEATMAP_HABITS = [1,0,2,4,5,5,3,2,0,3,5,4,3,1,0,4,5,3,2,0,1,2,4,5,5,3,2,0,4,5,3,1,4,2,1];
const HEATMAP_POINTS = [20,0,45,80,120,110,60,30,0,50,130,100,70,25,0,90,140,75,40,10,15,35,85,150,160,90,45,5,100,145,80,20,90,40,15];

function ModalCard({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={onClose}>
      <div style={{ background: '#18181b', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', border: '1px solid #27272a' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}><X size={22} /></button>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color, onClick }: any) {
  return (
    <div onClick={onClick} style={{ background: '#18181b', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid transparent' }}
      onMouseEnter={e => { if(onClick) { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.borderColor=`${color}40`; e.currentTarget.style.boxShadow=`0 8px 24px ${color}15`; } }}
      onMouseLeave={e => { if(onClick) { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.boxShadow='none'; } }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={24} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>{value}</p>
        {trend !== 0 && (
          <p style={{ margin: 0, fontSize: '12px', color: trend > 0 ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}% vs last week
          </p>
        )}
      </div>
      {onClick && <ArrowRight size={18} color="#71717a" />}
    </div>
  );
}

export default function Statistics() {
  const navigate = useNavigate();
  const [userPoints] = useState(() => {
    const saved = localStorage.getItem('kinetic_user_points');
    const points = saved ? Number.parseInt(saved, 10) : 1250;
    return Number.isFinite(points) ? points : 1250;
  });
  const [dayModal, setDayModal] = useState<{date: Date; fullDate: string; isFuture: boolean; level: number; habitsDone: number; points: number} | null>(null);
  const [completionModal, setCompletionModal] = useState(false);

  const today = useMemo(() => new Date(2026, 4, 24), []);

  const heatmapDays = useMemo(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - 28);
    const dow = start.getDay();
    const adjust = dow === 0 ? -6 : 1 - dow;
    start.setDate(start.getDate() + adjust);

    return Array.from({ length: 35 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const isFuture = d > today;
      const demoIdx = i % 30;
      const level = isFuture ? 0 : HEATMAP_LEVELS[demoIdx] ?? 0;
      const habitsDone = isFuture ? 0 : HEATMAP_HABITS[demoIdx] ?? 0;
      const points = isFuture ? 0 : HEATMAP_POINTS[demoIdx] ?? 0;

      return {
        date: d,
        dayNum: d.getDate(),
        month: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        fullDate: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        isFuture,
        level,
        habitsDone,
        points,
      };
    });
  }, [today]);

  const monthLabels = useMemo(() => {
    const labels: {month: string; index: number}[] = [];
    heatmapDays.forEach((day, idx) => {
      if (idx === 0 || day.month !== heatmapDays[idx-1].month) {
        labels.push({ month: day.month, index: idx });
      }
    });
    return labels;
  }, [heatmapDays]);

  const maxBar = Math.max(...WEEKLY_DATA.map(d => d.total));
  const maxPoints = Math.max(...POINTS_HISTORY.map(d => d.points));

  const heatColor = (level: number) => {
    if (level === 0) return '#27272a';
    if (level === 1) return '#3f3f46';
    if (level === 2) return '#a855f7';
    return '#7c3aed';
  };

  const getDayHabits = (habitsDone: number) => {
    const all = ['Morning Run', 'Read 10 Pages', 'Meditation', 'No Sugar', 'Code 1h'];
    return all.map((name, i) => ({
      name,
      done: i < habitsDone
    }));
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />
      <div className="dashboard-main">
        <AppHeader points={userPoints} />
        <div style={{ padding: '32px', overflowY: 'auto' }}>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 700, color: '#fff' }}>Statistics</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa' }}>
              Track your progress and build better habits with data.
            </p>
          </div>

          {/* 4 karty */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <StatCard icon={Target} label="Active Habits" value="5" trend={0} color="#3b82f6" onClick={() => navigate('/habits')} />
            <StatCard icon={CheckCircle2} label="Completion Rate" value="86%" trend={12} color="#22c55e" onClick={() => setCompletionModal(true)} />
            <StatCard icon={Flame} label="Best Streak" value="15 days" trend={25} color="#ef4444" onClick={() => navigate('/habits')} />
            <StatCard icon={Zap} label="Total Points" value={userPoints.toLocaleString()} trend={0} color="#a855f7" onClick={() => navigate('/rewards')} />
          </div>

          {/* Weekly + Heatmap */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>

            {/* Weekly Activity Chart */}
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>Weekly Activity</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#a1a1aa' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }} />
                  Completed
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3f3f46', marginLeft: '6px' }} />
                  Total
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '12px' }}>
                {WEEKLY_DATA.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/habits')} title="Go to Habit List">
                    <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px' }}>
                      <div style={{ width: '10px', height: `${(d.completed / maxBar) * 100}%`, background: 'linear-gradient(180deg, #a855f7, #7c3aed)', borderRadius: '5px 5px 0 0', minHeight: '4px' }} />
                      <div style={{ width: '10px', height: `${(d.total / maxBar) * 100}%`, background: '#3f3f46', borderRadius: '5px 5px 0 0', opacity: 0.35, minHeight: '4px' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap */}
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600, color: '#fff' }}>30-Day Heatmap</h3>

              {/* Month labels top */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '4px', paddingLeft: '0px' }}>
                {monthLabels.map((m, i) => (
                  <span key={i} style={{ fontSize: '10px', color: '#71717a', textAlign: 'left', gridColumnStart: m.index + 1, fontWeight: 600 }}>
                    {m.month}
                  </span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {heatmapDays.map((day, i) => (
                  <div 
                    key={i} 
                    onClick={() => !day.isFuture && setDayModal(day)}
                    style={{ 
                      aspectRatio: '1', 
                      borderRadius: '5px', 
                      background: day.isFuture ? '#1f1f23' : heatColor(day.level), 
                      cursor: day.isFuture ? 'default' : 'pointer',
                      opacity: day.isFuture ? 0.35 : 1,
                      border: '2px solid transparent',
                      transition: 'transform 0.15s, opacity 0.15s, border-color 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      color: day.isFuture ? '#52525b' : '#fff',
                      fontWeight: 700
                    }}
                    title={day.isFuture ? `${day.fullDate} - upcoming` : `${day.fullDate}: ${day.habitsDone} habits`}
                    onMouseEnter={e => { if(!day.isFuture) { e.currentTarget.style.transform = 'scale(1.25)'; e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.zIndex = '10'; } }}
                    onMouseLeave={e => { if(!day.isFuture) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.zIndex = '1'; } }}
                  >
                    {!day.isFuture ? day.dayNum : ''}
                  </div>
                ))}
              </div>

              {/* Months instead of Less/More */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '8px 0', borderTop: '1px solid #27272a' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {['Apr', 'May', 'Jun'].map((m, i) => (
                    <span key={m} style={{ 
                      fontSize: '12px', 
                      fontWeight: 600,
                      color: i === 1 ? '#e4e4e7' : '#52525b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {i === 2 && <Circle size={8} color="#52525b" />}
                      {m}
                      {i === 2 && <span style={{ fontSize: '10px', color: '#52525b', fontWeight: 400 }}>(empty)</span>}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#52525b' }}>Intensity:</span>
                  {[0,1,2,3].map(l => <div key={l} style={{ width: '8px', height: '8px', borderRadius: '2px', background: heatColor(l) }} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Habit Breakdown + Points History */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* Habit Breakdown - nieklikalny, bez View All */}
            <div style={{ background: '#18181b', borderRadius: '16px', padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>Habit Breakdown</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {HABITS.map((h, i) => (
                  <div key={i} style={{ padding: '8px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#e4e4e7' }}>{h.name}</span>
                      <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{h.completed}/{h.total} ({Math.round((h.completed / h.total) * 100)}%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(h.completed / h.total) * 100}%`, height: '100%', background: h.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <Flame size={12} color="#ef4444" />
                      <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 500 }}>{h.streak} day streak</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Points History */}
            <div onClick={() => navigate('/rewards')} style={{ background: '#18181b', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.01)'; e.currentTarget.style.borderColor='#a855f740'; e.currentTarget.style.boxShadow='0 8px 24px rgba(168,85,247,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>Points History</h3>
                <ArrowRight size={18} color="#71717a" />
              </div>
              <div style={{ position: 'relative', height: '200px', marginBottom: '12px' }}>
                <svg viewBox="0 0 300 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="pointsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon fill="url(#pointsGrad)" points={`0,150 ${POINTS_HISTORY.map((p, i) => { const x = (i / (POINTS_HISTORY.length - 1)) * 300; const y = 150 - (p.points / maxPoints) * 130; return `${x},${y}`; }).join(' ')} 300,150`} />
                  <polyline fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={POINTS_HISTORY.map((p, i) => { const x = (i / (POINTS_HISTORY.length - 1)) * 300; const y = 150 - (p.points / maxPoints) * 130; return `${x},${y}`; }).join(' ')} />
                  {POINTS_HISTORY.map((p, i) => { const x = (i / (POINTS_HISTORY.length - 1)) * 300; const y = 150 - (p.points / maxPoints) * 130; return <circle key={i} cx={x} cy={y} r="4" fill="#a855f7" stroke="#18181b" strokeWidth="2" />; })}
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {POINTS_HISTORY.map((p, i) => (
                  <span key={i} style={{ fontSize: '11px', color: '#71717a' }}>{p.day}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL: szczegoly dnia z heatmapy */}
      {dayModal && (
        <ModalCard onClose={() => setDayModal(null)}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: heatColor(dayModal.level), display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '3px solid #27272a' }}>
              <Calendar size={28} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#fff' }}>{dayModal.fullDate}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa' }}>
              {dayModal.habitsDone === 0 ? 'Rest day - no habits logged' : `${dayModal.habitsDone} of 5 habits completed`}
            </p>
          </div>

          {dayModal.habitsDone > 0 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {getDayHabits(dayModal.habitsDone).map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#27272a', borderRadius: '10px', border: h.done ? '1px solid #22c55e30' : '1px solid transparent' }}>
                    <span style={{ fontSize: '14px', color: '#e4e4e7', fontWeight: 500 }}>{h.name}</span>
                    {h.done ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>
                        <CheckCircle2 size={16} /> Done
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#52525b', fontSize: '13px' }}>
                        <Circle size={16} /> Missed
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg, #a855f720, #7c3aed20)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #a855f740' }}>
                <Zap size={18} color="#a855f7" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>+{dayModal.points} points earned</span>
              </div>
            </>
          )}

          {dayModal.habitsDone === 0 && (
            <div style={{ background: '#27272a', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
              <Info size={24} color="#71717a" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa' }}>
                Nothing logged for this day. Every day is a new chance to build your streak!
              </p>
            </div>
          )}

          <button onClick={() => { setDayModal(null); navigate('/habits'); }} style={{ width: '100%', padding: '12px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Go to Habit List <ArrowRight size={16} />
          </button>
        </ModalCard>
      )}

      {/* MODAL: Completion Rate szczegoly */}
      {completionModal && (
        <ModalCard onClose={() => setCompletionModal(false)}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={28} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#fff' }}>Completion Breakdown</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa' }}>86% average this week</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {WEEKLY_DATA.map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: '#e4e4e7', fontWeight: 500 }}>{d.day}</span>
                  <span style={{ color: d.completed === d.total ? '#22c55e' : '#a1a1aa' }}>{d.completed}/{d.total}</span>
                </div>
                <div style={{ height: '6px', background: '#27272a', borderRadius: '3px' }}>
                  <div style={{ width: `${(d.completed / d.total) * 100}%`, height: '100%', background: d.completed === d.total ? '#22c55e' : '#a855f7', borderRadius: '3px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#27272a', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={20} color="#a855f7" />
            <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>
              Days marked green are perfect days. Keep pushing to get 100% every day!
            </p>
          </div>
          <button onClick={() => { setCompletionModal(false); navigate('/habits'); }} style={{ width: '100%', padding: '12px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            Check Today's Tasks
          </button>
        </ModalCard>
      )}

    </div>
  );
}
