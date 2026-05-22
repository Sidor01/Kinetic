import { useNavigate } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import './Dashboard.css';

export default function Placeholder({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <AppSidebar />

      {/* Main Content */}
      <div className="dashboard-main">
        <AppHeader />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 80px)' }}>
          <h1>{title}</h1>
          <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>This page is not yet implemented.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#a855f7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
