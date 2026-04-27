






import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    { name: 'username', type: 'text',     label: 'Username', placeholder: 'johndoe' },
    { name: 'email',    type: 'email',    label: 'Email',    placeholder: 'you@email.com' },
    { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🛍</div>
        <h1 style={s.title}>Create account</h1>
        <p style={s.subtitle}>Join ShopEasy and start shopping</p>

        {error   && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          {fields.map(({ name, type, label, placeholder }) => (
            <div key={name} style={s.field}>
              <label style={s.label}>{label}</label>
              <input
                style={{ ...s.input, ...(focused === name ? s.inputFocused : {}) }}
                type={type} name={name} placeholder={placeholder}
                value={form[name]} onChange={handleChange}
                onFocus={() => setFocused(name)} onBlur={() => setFocused(null)}
                required
              />
            </div>
          ))}
          <button style={{ ...s.btn, opacity: loading ? 0.75 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={s.switch}>
          Already have an account? <Link to="/login" style={s.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#F5F6FA', padding: '20px',
  },
  card: {
    background: 'white', borderRadius: '14px', padding: '48px 44px',
    width: '100%', maxWidth: '420px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
    animation: 'fadeUp 0.4s ease',
  },
  logo:    { fontSize: '36px', marginBottom: '16px' },
  title:   { fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '6px' },
  subtitle:{ fontSize: '14px', color: '#6B7280', marginBottom: '28px' },
  error: {
    background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
    padding: '11px 14px', borderRadius: '8px', fontSize: '13px',
    marginBottom: '20px', textAlign: 'left',
  },
  success: {
    background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#059669',
    padding: '11px 14px', borderRadius: '8px', fontSize: '13px',
    marginBottom: '20px', textAlign: 'left',
  },
  form:  { display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: {
    padding: '11px 14px', border: '1.5px solid #E4E7EC', borderRadius: '8px',
    fontSize: '14px', outline: 'none', fontFamily: 'Outfit, sans-serif',
    color: '#111827', background: '#FAFAFA', transition: 'all 0.15s',
  },
  inputFocused: { borderColor: '#4F46E5', background: 'white', boxShadow: '0 0 0 3px rgba(79,70,229,0.1)' },
  btn: {
    marginTop: '6px', padding: '12px', background: '#4F46E5', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  },
  switch:     { marginTop: '24px', fontSize: '13px', color: '#6B7280' },
  switchLink: { color: '#4F46E5', fontWeight: '600', textDecoration: 'none' },
};


