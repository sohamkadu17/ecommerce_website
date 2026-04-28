import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    if (!email.trim()) {
      setStatus('Please enter your email address.');
      setLoading(false);
      return;
    }

    setStatus('If an account exists for this email, a reset link has been sent.');
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Reset your password</h1>
        <p style={s.subtitle}>Enter your email and we will send you a reset link.</p>

        {status && <div style={s.status}>{status}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button style={{ ...s.btn, opacity: loading ? 0.75 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p style={s.backRow}>
          <Link to="/login" style={s.backLink}>Back to login</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F6FA',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '14px',
    padding: '48px 44px',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'left',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
  },
  title: { fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: '#6B7280', marginBottom: '24px' },
  status: {
    background: '#EEF2FF',
    border: '1px solid #C7D2FE',
    color: '#3730A3',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '18px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #E4E7EC',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    color: '#111827',
    background: '#FAFAFA',
  },
  btn: {
    marginTop: '4px',
    padding: '12px',
    background: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  backRow: { marginTop: '18px', fontSize: '13px' },
  backLink: { color: '#4F46E5', fontWeight: '600', textDecoration: 'none' },
};
