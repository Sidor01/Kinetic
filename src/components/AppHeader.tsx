import type { CSSProperties } from 'react';
import { Bell, Zap } from 'lucide-react';

interface AppHeaderProps {
    style?: CSSProperties;
}

export default function AppHeader({ style }: AppHeaderProps) {
    return (
        <div className="header-top" style={style}>
            <Bell size={24} color="#a1a1aa" />
            <div className="pts-badge">
                <Zap size={16} fill="currentColor" />
                1,250 PTS
            </div>
        </div>
    );
}
