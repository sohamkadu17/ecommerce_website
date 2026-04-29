import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      if (step === 'email') {
        if (!email.trim()) {
          setStatus('Please enter your email address.');
          setLoading(false);
          return;
        }

        const { data } = await API.post('/auth/forgot-password', { email: email.trim() });
        setStatus(data?.message || 'If an account exists, an OTP has been sent.');
        setStep('reset');
      } else {
        if (!otp.trim() || !newPassword) {
          setStatus('Please enter the OTP and a new password.');
          setLoading(false);
          return;
        }

        const { data } = await API.post('/auth/reset-password', {
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        });
        setStatus(data?.message || 'Password updated successfully.');
        setOtp('');
        setNewPassword('');
        setStep('email');
      }
    } catch (err) {
      setStatus(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Reset your password</h1>
        <p style={s.subtitle}>
          {step === 'email'
            ? 'Enter your email and we will send you an OTP.'
            : 'Enter the OTP and choose a new password.'}
        </p>

        {status && <div style={s.status}>{status}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step !== 'email'}
            required
          />

          {step === 'reset' && (
            <>
              <label style={s.label}>OTP</label>
              <input
                style={s.input}
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <label style={s.label}>New password</label>
              <div style={s.passwordRow}>
                <input
                  style={{ ...s.input, ...s.passwordInput }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={s.toggleBtn}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </>
          )}

          <button style={{ ...s.btn, opacity: loading ? 0.75 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Sending...' : step === 'email' ? 'Send OTP' : 'Reset password'}
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
  passwordRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  passwordInput: { flex: 1 },
  toggleBtn: {
    padding: '10px 12px',
    border: '1.5px solid #E4E7EC',
    borderRadius: '8px',
    background: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#374151',
    fontFamily: 'Outfit, sans-serif',
  },
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
