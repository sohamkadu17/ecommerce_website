import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/admin/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (e) {
      setError(e.response?.data?.error || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.tag}>Admin Portal</p>
        <h1 style={s.title}>Control Center Login</h1>
        <p style={s.sub}>Use fixed admin credentials configured on the server.</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit} style={s.form}>
          <label style={s.label}>Admin Email</label>
          <input
            style={s.input}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button style={s.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <p style={s.switchLine}>
          User account? <Link to="/login" style={s.link}>Go to user login</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'radial-gradient(circle at 20% 20%, #FEE2E2 0%, #F8FAFC 40%, #E2E8F0 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid #E5E7EB',
    boxShadow: '0 10px 35px rgba(15, 23, 42, 0.12)',
    padding: '30px',
  },
  tag: {
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#991B1B',
    fontWeight: 700,
    marginBottom: '8px',
  },
  title: { fontSize: '27px', color: '#111827', marginBottom: '8px' },
  sub: { fontSize: '13px', color: '#6B7280', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '13px', color: '#374151', fontWeight: 600 },
  input: {
    border: '1.5px solid #E4E7EC',
    borderRadius: '10px',
    padding: '11px 12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
  },
  btn: {
    marginTop: '8px',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 14px',
    background: '#B91C1C',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  error: {
    border: '1px solid #FECACA',
    background: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  switchLine: { marginTop: '16px', color: '#6B7280', fontSize: '13px' },
  link: { color: '#B91C1C', textDecoration: 'none', fontWeight: 700 },
};
