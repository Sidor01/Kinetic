import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, HeartPulse, CheckCircle2 } from 'lucide-react';
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
const TREND_HEIGHTS_14 = [40, 60, 30, 70, 50, 40, 20, 80, 50, 60, 60, 60, 20, 50];
const TREND_DAYS_30 = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T'];
const TREND_HEIGHTS_30 = [40, 60, 30, 70, 50, 40, 20, 80, 50, 60, 60, 60, 20, 50, 40, 60, 30, 70, 50, 40, 20, 80, 50, 60, 60, 60, 20, 50, 40, 60];

function generateMatrixData(): string[][] {
    return Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 14 }, (_, c) => {
            if (c === 13 && r > 3) return 'l0';
            const rnd = Math.random();
            if (rnd > 0.8) return 'l4';
            if (rnd > 0.6) return 'l3';
            if (rnd > 0.3) return 'l2';
            if (rnd > 0.1) return 'l1';
            return 'l0';
        })
    );
}

export default function DailyMeditationDetail() {
    const navigate = useNavigate();
    useAuth();

    const [matrixData] = useState(generateMatrixData);
    const [trendPeriod, setTrendPeriod] = useState<14 | 30>(14);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showImmersionModal, setShowImmersionModal] = useState(false);
    const [notes, setNotes] = useState<Note[]>([
        { id: 1, date: 'Yesterday, 9:15 PM', text: 'Felt much more centered today. Focusing on the breath at the tip of the nose helps keep the mind from wandering.' },
        { id: 2, date: '3 days ago', text: 'Struggled with distractions today. Will try a guided session tomorrow morning instead of evening.' },
        { id: 3, date: 'Oct 12', text: 'Reached 30-day milestone! Mental clarity has noticeably improved during work hours.' },
        { id: 4, date: 'Oct 05', text: 'Skipped morning meditation but did a quick 5-min session before bed. Consistency is key.' },
        { id: 5, date: 'Sept 28', text: "Feeling great. Today's session was extremely deep. The new breathing pattern works well." },
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
                            <h1>Daily Meditation</h1>
                            <p>Mindfulness and mental clarity session.</p>
                        </div>
                        <button
                            className={`hd-complete-btn ${isCompleted ? 'completed' : ''}`}
                            onClick={() => { if (!isCompleted) setShowImmersionModal(true); }}
                        >
                            {isCompleted ? <><CheckCircle2 size={16} /> Session Completed</> : 'Complete Session'}
                        </button>
                    </div>

                    <div className="hd-grid-top">
                        <MomentumCard
                            streak={isCompleted ? 43 : 42}
                            gradientId="ring-grad-meditation"
                            gradientStart="#875afb"
                            gradientEnd="#4ade80"
                            dashoffset={68}
                            streakSubColor="#c084fc"
                            icon={<HeartPulse size={16} className="hd-heart-icon" style={isCompleted ? { color: '#4ade80' } : {}} />}
                            rewardPercent={85}
                            rewardAccentColor="#875afb"
                            rewardLabel='8 DAYS REMAINING FOR "ZEN MASTER" BADGE'
                        />

                        <ConsistencyMatrix
                            matrixData={matrixData}
                            stat1={{ value: '142', label: 'TOTAL SITTINGS' }}
                            stat2={{ value: '15.5h', label: 'DEEP FOCUS' }}
                            lastUpdated="Today, 8:42 AM"
                        />
                    </div>

                    <div className="hd-grid-mid">
                        <TrendsChart
                            title="Session Duration Trends"
                            subtitle={`Minutes per session over the last ${trendPeriod} days`}
                            trendPeriod={trendPeriod}
                            onChangePeriod={setTrendPeriod}
                            trendDays={trendDays}
                            trendHeights={trendHeights}
                        />

                        <JournalCard
                            notes={notes}
                            onAddNote={(text) => setNotes([{ id: Date.now(), date: 'Just now', text }, ...notes])}
                            accentColor="#a855f7"
                            placeholder="How did your session go?"
                        />
                    </div>

                    <AchievementCard
                        title="Zen Master Achievement"
                        description={<>Complete 50 consecutive days of meditation <strong>42 / 50</strong></>}
                        rewardValue="+5,000 XP"
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
                            title: 'Meditation Completed',
                            message: `${data.duration} minutes of meditation sealed at ${data.intensity.toLowerCase()} intensity.`,
                            tone: 'success',
                            icon: 'check',
                            actionLabel: 'View Habits',
                            actionPath: '/habits',
                        });
                        if (data.notes.trim()) {
                            setNotes([{ id: Date.now(), date: 'Just now', text: data.notes }, ...notes]);
                        }
                    }}
                    defaultDuration={15}
                />
            )}
        </div>
    );
}
