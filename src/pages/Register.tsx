import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('[Register] calling createUserWithEmailAndPassword...');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[Register] SUCCESS — UID:', cred.user.uid, 'email:', cred.user.email);
      await updateProfile(cred.user, { displayName: name });
      navigate('/');
    } catch (err: unknown) {
      console.error('[Register] FAILED:', err);
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        setError('Account with this email already exists');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else {
        setError(`Registration failed (${code ?? 'unknown'}). Check the browser console for details.`);
      }
    } finally {
      setLoading(false);
    }
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

          <button type="submit" className="auth-button" style={{ marginTop: '16px' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Initiate Ritual'} <span>→</span>
          </button>
        </form>

        <div className="auth-footer">
          Already part of the flow? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
}
