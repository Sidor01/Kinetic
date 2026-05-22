import type { CSSProperties } from 'react';

interface ConsistencyMatrixProps {
    matrixData: string[][];
    /** Override background color per level class key (e.g. { l1: '#1d4ed8', l2: '#2563eb', l3: '#3b82f6', l4: '#06b6d4' }) */
    cellColorMap?: Record<string, string>;
    /** Override legend dot colors for l1, l3, l4 */
    legendColors?: { l1?: string; l3?: string; l4?: string };
    stat1: { value: string; label: string };
    stat2: { value: string; label: string };
    lastUpdated: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function colorStyle(color: string | undefined): CSSProperties {
    return color ? { background: color } : {};
}

export default function ConsistencyMatrix({
    matrixData,
    cellColorMap = {},
    legendColors = {},
    stat1,
    stat2,
    lastUpdated,
}: ConsistencyMatrixProps) {
    return (
        <div className="hd-card hd-card-matrix">
            <div className="hd-matrix-header">
                <h3>Consistency Matrix</h3>
                <div className="hd-legend">
                    LESS
                    <div className="hd-legend-box l0" />
                    <div className="hd-legend-box l1" style={colorStyle(legendColors.l1)} />
                    <div className="hd-legend-box l3" style={colorStyle(legendColors.l3)} />
                    <div className="hd-legend-box l4" style={colorStyle(legendColors.l4)} />
                    MORE
                </div>
            </div>

            <div className="hd-matrix-grid">
                {DAYS.map((day, rowIndex) => (
                    <div key={day} style={{ display: 'contents' }}>
                        <div className="hd-matrix-day">{day}</div>
                        {matrixData[rowIndex].map((cls, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`hd-matrix-box ${cls}`}
                                style={colorStyle(cellColorMap[cls])}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="hd-matrix-stats">
                <div className="hd-stat-group">
                    <h4>{stat1.value}</h4>
                    <p>{stat1.label}</p>
                </div>
                <div className="hd-stat-group">
                    <h4>{stat2.value}</h4>
                    <p>{stat2.label}</p>
                </div>
                <div className="hd-stat-right">Last updated: {lastUpdated}</div>
            </div>
        </div>
    );
}
