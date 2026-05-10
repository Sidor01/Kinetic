import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const usersStr = localStorage.getItem('kinetic_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const existingUser = users.find((u: { email: string }) => u.email === email);
    if (existingUser) {
      setError('Account with this email already exists');
      return;
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem('kinetic_users', JSON.stringify(users));
    
    // Automatically log the user in
    localStorage.setItem('kinetic_currentUser', JSON.stringify(newUser));
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-logo">
          <span className="kin">Kin</span><span className="etic">etic</span>
        </div>
        <p className="auth-subtitle">Forge your path. Track your momentum.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                className="input-field"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="auth-button" style={{ marginTop: '16px' }}>
            Initiate Ritual <span>→</span>
          </button>
        </form>
        
        <div className="auth-footer">
          Already part of the flow? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
}
