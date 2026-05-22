import { CSSProperties } from 'react';

interface TrendsChartProps {
    title: string;
    subtitle: string;
    trendPeriod: 14 | 30;
    onChangePeriod: (period: 14 | 30) => void;
    trendDays: string[];
    trendHeights: number[];
    /** Optional override for bar background; receives height value. When omitted, CSS classes handle colours. */
    getBarStyle?: (height: number) => CSSProperties;
}

export default function TrendsChart({
    title,
    subtitle,
    trendPeriod,
    onChangePeriod,
    trendDays,
    trendHeights,
    getBarStyle,
}: TrendsChartProps) {
    return (
        <div className="hd-card hd-card-trends">
            <div className="hd-trends-header">
                <div className="hd-trends-title">
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                </div>
                <div className="hd-trends-toggle">
                    <button className={trendPeriod === 14 ? 'active' : ''} onClick={() => onChangePeriod(14)}>14D</button>
                    <button className={trendPeriod === 30 ? 'active' : ''} onClick={() => onChangePeriod(30)}>30D</button>
                </div>
            </div>

            <div className="hd-trends-chart">
                {trendHeights.map((h, i) => (
                    <div
                        key={i}
                        className="hd-trend-bar-wrapper"
                        style={{ width: trendPeriod === 30 ? '10px' : '14px', gap: trendPeriod === 30 ? '4px' : '6px' }}
                    >
                        <div
                            className={`hd-trend-bar ${h > 70 ? 'highlight' : h < 30 ? 'low' : ''}`}
                            style={{
                                height: `${h}%`,
                                width: trendPeriod === 30 ? '6px' : '10px',
                                ...(getBarStyle ? getBarStyle(h) : {}),
                            }}
                        />
                        <div className="hd-trend-day" style={{ fontSize: trendPeriod === 30 ? '8px' : '9px' }}>
                            {trendDays[i]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
