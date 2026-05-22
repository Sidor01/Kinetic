import { CSSProperties, ReactNode } from 'react';
import { Medal } from 'lucide-react';

interface AchievementCardProps {
    title: string;
    description: ReactNode;
    badgeStyle?: CSSProperties;
    badgeIconColor?: string;
    barFillStyle?: CSSProperties;
    rewardValue: string;
    rewardValueColor?: string;
}

export default function AchievementCard({
    title,
    description,
    badgeStyle,
    badgeIconColor,
    barFillStyle,
    rewardValue,
    rewardValueColor,
}: AchievementCardProps) {
    return (
        <div className="hd-card hd-achievement">
            <div className="hd-ach-badge" style={badgeStyle}>
                <Medal size={32} className="hd-ach-icon" style={badgeIconColor ? { color: badgeIconColor } : {}} />
            </div>
            <div className="hd-ach-info">
                <h3>{title}</h3>
                <p className="hd-ach-desc">{description}</p>
                <div className="hd-ach-bar-bg">
                    <div className="hd-ach-bar-fill" style={barFillStyle} />
                </div>
            </div>
            <div className="hd-ach-reward">
                <div className="hd-ach-reward-lbl">REWARD VALUE</div>
                <div className="hd-ach-reward-val" style={rewardValueColor ? { color: rewardValueColor } : {}}>
                    {rewardValue}
                </div>
            </div>
        </div>
    );
}
