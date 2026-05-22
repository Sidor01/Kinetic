import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart2, Trophy, Settings } from 'lucide-react';

export default function AppSidebar() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-sidebar">
            <div className="sidebar-logo">Kinetic</div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
                    <LayoutDashboard className="nav-icon" size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/habits" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <CheckSquare className="nav-icon" size={20} />
                    <span>Habit List</span>
                </NavLink>
                <NavLink to="/statistics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <BarChart2 className="nav-icon" size={20} />
                    <span>Statistics</span>
                </NavLink>
                <NavLink to="/rewards" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Trophy className="nav-icon" size={20} />
                    <span>Rewards</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Settings className="nav-icon" size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div
                className="user-profile"
                onClick={() => navigate('/settings')}
                style={{ cursor: 'pointer' }}
                title="Go to settings"
            >
                <div className="user-avatar">
                    <span role="img" aria-label="avatar">👨‍💼</span>
                </div>
                <div className="user-info">
                    <span className="user-level">Level 24</span>
                    <span className="user-title">Master Architect</span>
                </div>
            </div>
        </div>
    );
}
