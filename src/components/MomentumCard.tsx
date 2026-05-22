import { CSSProperties, ReactNode } from 'react';

interface MomentumCardProps {
    streak: number;
    gradientId: string;
    gradientStart: string;
    gradientEnd: string;
    /** strokeDashoffset: 0 = full ring, 452 = empty (circumference ≈ 2π×72) */
    dashoffset: number;
    /** Extra inline styles applied to the streak number h2 (e.g. gradient text for blue theme) */
    streakTextStyle?: CSSProperties;
    /** Color of the "Day Streak" sub-label */
    streakSubColor?: string;
    /** Icon rendered below the sub-label (e.g. HeartPulse or Brain) */
    icon: ReactNode;
    rewardPercent: number;
    rewardAccentColor: string;
    /** Extra inline styles applied to the progress bar fill */
    rewardBarStyle?: CSSProperties;
    rewardLabel: string;
}

export default function MomentumCard({
    streak,
    gradientId,
    gradientStart,
    gradientEnd,
    dashoffset,
    streakTextStyle,
    streakSubColor = '#c084fc',
    icon,
    rewardPercent,
    rewardAccentColor,
    rewardBarStyle,
    rewardLabel,
}: MomentumCardProps) {
    return (
        <div className="hd-card hd-card-momentum">
            <h3 className="hd-card-title">CURRENT MOMENTUM</h3>

            <div className="hd-ring-container">
                <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={gradientStart} />
                            <stop offset="100%" stopColor={gradientEnd} />
                        </linearGradient>
                    </defs>
                    <circle cx="80" cy="80" r="72" fill="none" stroke="#27272a" strokeWidth="6" />
                    <circle
                        cx="80" cy="80" r="72"
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="6"
                        strokeDasharray="452"
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 80 80)"
                    />
                </svg>
                <div className="hd-ring-text">
                    <h2 style={{ fontSize: '48px', ...streakTextStyle }}>{streak}</h2>
                    <p style={{ fontSize: '11px', color: streakSubColor }}>Day Streak</p>
                    {icon}
                </div>
            </div>

            <div className="hd-reward-box">
                <div className="hd-reward-top">
                    <span>Next Reward</span>
                    <span style={{ color: rewardAccentColor }}>{rewardPercent}%</span>
                </div>
                <div className="hd-progress-bar-bg">
                    <div className="hd-progress-bar-fill" style={{ width: `${rewardPercent}%`, ...rewardBarStyle }} />
                </div>
                <div className="hd-reward-bottom">{rewardLabel}</div>
            </div>
        </div>
    );
}
