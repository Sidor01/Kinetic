import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Brain, CheckCircle2, Code2 } from 'lucide-react';
import LogImmersionModal from '../components/LogImmersionModal';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import MomentumCard from '../components/MomentumCard';
import ConsistencyMatrix from '../components/ConsistencyMatrix';
import TrendsChart from '../components/TrendsChart';
import JournalCard from '../components/JournalCard';
import type { Note } from '../components/JournalCard';
import AchievementCard from '../components/AchievementCard';
import { createNotification } from '../utils/notifications';
import './Dashboard.css';
import './HabitDetail.css';

const TREND_DAYS_14 = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TREND_HEIGHTS_14 = [50, 70, 40, 60, 80, 30, 20, 60, 90, 50, 70, 80, 25, 60];
const TREND_DAYS_30 = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T'];
const TREND_HEIGHTS_30 = [50, 70, 40, 60, 80, 30, 20, 60, 90, 50, 70, 80, 25, 60, 50, 70, 40, 60, 80, 30, 20, 60, 90, 50, 70, 80, 25, 60, 50, 70];

const ALGO_CELL_COLORS = { l1: '#1d4ed8', l2: '#2563eb', l3: '#3b82f6', l4: '#06b6d4' };
const ALGO_LEGEND_COLORS = { l1: '#1d4ed8', l3: '#3b82f6', l4: '#06b6d4' };

function generateMatrixData(): string[][] {
    return Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 14 }, (_, c) => {
            if (c === 13 && r > 4) return 'l0';
            const rnd = Math.random();
            if (rnd > 0.85) return 'l4';
            if (rnd > 0.65) return 'l3';
            if (rnd > 0.35) return 'l2';
            if (rnd > 0.15) return 'l1';
            return 'l0';
        })
    );
}

export default function AlgorithmStudyDetail() {
    const navigate = useNavigate();
    useAuth();

    const [matrixData] = useState(generateMatrixData);
    const [trendPeriod, setTrendPeriod] = useState<14 | 30>(14);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showImmersionModal, setShowImmersionModal] = useState(false);
    const [notes, setNotes] = useState<Note[]>([
        { id: 1, date: 'Yesterday, 10:30 PM', text: 'Finally cracked the knapsack problem variant. Key insight: thinking in terms of state transitions instead of "choices" makes DP click.' },
        { id: 2, date: '2 days ago', text: 'Struggled with graph traversal edge cases. BFS vs DFS trade-offs are clearer now after the maze problem set.' },
        { id: 3, date: 'Oct 15', text: '20-day milestone! Solved 5 medium LeetCode problems this week. Pattern recognition is getting stronger.' },
        { id: 4, date: 'Oct 08', text: 'Reviewed sliding window patterns. Two-pointer technique saves so much time on array problems.' },
        { id: 5, date: 'Sept 30', text: 'Started the binary search deep-dive. These problems always trip me up but getting better.' },
    ]);

    const trendDays = trendPeriod === 14 ? TREND_DAYS_14 : TREND_DAYS_30;
    const trendHeights = trendPeriod === 14 ? TREND_HEIGHTS_14 : TREND_HEIGHTS_30;

    return (
        <div className="dashboard-container">
            <AppSidebar />

            <div className="dashboard-main">
                <AppHeader style={{ padding: '0 40px', marginTop: '16px', marginBottom: '8px' }} />

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
                            onClick={() => { if (!isCompleted) setShowImmersionModal(true); }}
                        >
                            {isCompleted ? <><CheckCircle2 size={16} /> Session Completed</> : 'Start Session'}
                        </button>
                    </div>

                    <div className="hd-grid-top">
                        <MomentumCard
                            streak={isCompleted ? 19 : 18}
                            gradientId="ring-grad-algo"
                            gradientStart="#3b82f6"
                            gradientEnd="#06b6d4"
                            dashoffset={181}
                            streakTextStyle={{ background: 'linear-gradient(180deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                            streakSubColor="#60a5fa"
                            icon={<Brain size={16} className="hd-heart-icon" style={isCompleted ? { color: '#06b6d4' } : { color: '#a1a1aa' }} />}
                            rewardPercent={60}
                            rewardAccentColor="#3b82f6"
                            rewardBarStyle={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
                            rewardLabel='12 DAYS REMAINING FOR "CODE SENSEI" BADGE'
                        />

                        <ConsistencyMatrix
                            matrixData={matrixData}
                            cellColorMap={ALGO_CELL_COLORS}
                            legendColors={ALGO_LEGEND_COLORS}
                            stat1={{ value: '247', label: 'PROBLEMS SOLVED' }}
                            stat2={{ value: '48h', label: 'DEEP FOCUS' }}
                            lastUpdated="Today, 11:15 PM"
                        />
                    </div>

                    <div className="hd-grid-mid">
                        <TrendsChart
                            title="Problems Solved Trends"
                            subtitle={`Number of problems per session over the last ${trendPeriod} days`}
                            trendPeriod={trendPeriod}
                            onChangePeriod={setTrendPeriod}
                            trendDays={trendDays}
                            trendHeights={trendHeights}
                            getBarStyle={(h) => ({
                                background: h > 70 ? 'linear-gradient(180deg, #06b6d4, #3b82f6)' : h < 30 ? '#27272a' : '#1d4ed8',
                            })}
                        />

                        <JournalCard
                            notes={notes}
                            onAddNote={(text) => setNotes([{ id: Date.now(), date: 'Just now', text }, ...notes])}
                            accentColor="#3b82f6"
                            placeholder="What did you study today?"
                            saveBtnStyle={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }}
                        />
                    </div>

                    {/* Difficulty Breakdown */}
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

                    <AchievementCard
                        title="Code Sensei Achievement"
                        description={<>Complete 30 consecutive days of algorithm study <strong>18 / 30</strong></>}
                        badgeStyle={{ background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)' }}
                        badgeIconColor="#60a5fa"
                        barFillStyle={{ width: '60%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
                        rewardValue="+4,000 XP"
                        rewardValueColor="#60a5fa"
                    />
                </div>
            </div>

            {showImmersionModal && (
                <LogImmersionModal
                    onClose={() => setShowImmersionModal(false)}
                    onSeal={(data) => {
                        setIsCompleted(true);
                        setShowImmersionModal(false);
                        createNotification({
                            title: 'Algorithm Study Completed',
                            message: `${data.duration} minutes of focused study sealed at ${data.intensity.toLowerCase()} intensity.`,
                            tone: 'success',
                            icon: 'book',
                            actionLabel: 'View Habits',
                            actionPath: '/habits',
                        });
                        if (data.notes.trim()) {
                            setNotes([{ id: Date.now(), date: 'Just now', text: data.notes }, ...notes]);
                        }
                    }}
                    defaultDuration={60}
                />
            )}
        </div>
    );
}
