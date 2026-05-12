import { useState } from 'react';
import { X, Minus, Plus, Droplet, Flame, Lock } from 'lucide-react';
import './LogImmersionModal.css';

interface LogImmersionModalProps {
  onClose: () => void;
  onSeal: (data: { duration: number; notes: string; intensity: 'Light' | 'Deep' }) => void;
  defaultDuration?: number;
}

export default function LogImmersionModal({ onClose, onSeal, defaultDuration = 45 }: LogImmersionModalProps) {
  const [duration, setDuration] = useState(defaultDuration);
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState<'Light' | 'Deep'>('Deep');

  const handleDecrease = () => setDuration(prev => Math.max(1, prev - 5));
  const handleIncrease = () => setDuration(prev => prev + 5);

  const handleSeal = () => {
    onSeal({ duration, notes, intensity });
  };

  return (
    <div className="lim-overlay">
      <div className="lim-modal">
        <button className="lim-close" onClick={onClose}><X size={16} /></button>
        
        <div className="lim-header">
          <h2>Log Your Immersion</h2>
          <p>Seal the session and document your focus.</p>
        </div>

        <div className="lim-section">
          <label>Duration (Minutes)</label>
          <div className="lim-duration-picker">
            <button className="lim-dur-btn" onClick={handleDecrease}><Minus size={16} /></button>
            <div className="lim-dur-value">{duration}</div>
            <button className="lim-dur-btn" onClick={handleIncrease}><Plus size={16} /></button>
          </div>
        </div>

        <div className="lim-section">
          <label>Reflection Notes</label>
          <textarea 
            className="lim-textarea"
            placeholder="What breakthroughs did you experience?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="lim-section">
          <label>Focus Intensity</label>
          <div className="lim-intensity-grid">
            <button 
              className={`lim-int-btn ${intensity === 'Light' ? 'active' : ''}`}
              onClick={() => setIntensity('Light')}
            >
              <Droplet size={16} className="lim-int-icon" />
              Light
            </button>
            <button 
              className={`lim-int-btn ${intensity === 'Deep' ? 'active' : ''}`}
              onClick={() => setIntensity('Deep')}
            >
              <Flame size={16} className="lim-int-icon" />
              Deep
            </button>
          </div>
        </div>

        <button className="lim-seal-btn" onClick={handleSeal}>
          Seal Ritual <Lock size={16} />
        </button>
      </div>
    </div>
  );
}
