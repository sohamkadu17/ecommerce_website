import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '', created_at: '', role: 'user' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setProfile(data);
      setProfileForm({ username: data.username || '', email: data.email || '' });
      localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username, email: data.email, role: data.role || 'user' }));

      if (data?.id) {
        const [addrRes, ordersRes] = await Promise.all([
          API.get(`/address/${data.id}`),
          API.get(`/orders/${data.id}`),
        ]);
        setAddresses(addrRes.data || []);
        setOrders(ordersRes.data || []);
      }
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSavingProfile(true);
    try {
      const { data } = await API.patch('/auth/me', profileForm);
      setMsg(data.message || 'Profile updated');
      setProfile((prev) => ({ ...prev, ...profileForm }));
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSavingPassword(true);
    try {
      const { data } = await API.patch('/auth/change-password', passwordForm);
      setMsg(data.message || 'Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div style={s.loading}>Loading profile...</div>;
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>My Profile</h1>
        <p style={s.sub}>Review your details, delivery addresses, and order history in one place</p>
      </div>

      {msg && <div style={s.success}>{msg}</div>}
      {err && <div style={s.error}>{err}</div>}

      <div style={s.topGrid}>
        <div style={s.profileHero}>
          <div style={s.avatar}>{(profile.username || 'U').slice(0, 1).toUpperCase()}</div>
          <div>
            <p style={s.heroLabel}>Account Overview</p>
            <h2 style={s.heroName}>{profile.username || 'User'}</h2>
            <p style={s.heroMeta}>{profile.email}</p>
            <p style={s.heroMeta}>Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>

        <div style={s.quickStats}>
          <div style={s.statBox}>
            <span style={s.statNum}>{addresses.length}</span>
            <span style={s.statText}>Saved Addresses</span>
          </div>
          <div style={s.statBox}>
            <span style={s.statNum}>{orders.length}</span>
            <span style={s.statText}>Total Orders</span>
          </div>
          <div style={s.statBox}>
            <span style={s.statNum}>{orders.filter((o) => o.status === 'delivered').length}</span>
            <span style={s.statText}>Delivered</span>
          </div>
        </div>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Account Info</h2>
          <p style={s.meta}>Member since {new Date(profile.created_at).toLocaleDateString('en-IN')}</p>

          <form onSubmit={saveProfile} style={s.form}>
            <label style={s.label}>Username</label>
            <input
              style={s.input}
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              required
            />

            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
            />

            <button style={s.primaryBtn} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>Change Password</h2>
          <form onSubmit={changePassword} style={s.form}>
            <label style={s.label}>Current Password</label>
            <input
              style={s.input}
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />

            <label style={s.label}>New Password</label>
            <input
              style={s.input}
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              minLength={6}
              required
            />

            <button style={s.secondaryBtn} disabled={savingPassword}>
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          <p style={s.tip}>Tip: Use at least 6 characters for better security.</p>
        </div>
      </div>

      <div style={s.bottomGrid}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Delivery Addresses</h2>
          {addresses.length === 0 ? (
            <p style={s.emptyText}>No saved address yet.</p>
          ) : (
            <div style={s.list}>
              {addresses.map((address) => (
                <div key={address.address_id} style={s.listItem}>
                  <p style={s.listTitle}>Address #{address.address_id}</p>
                  <p style={s.listText}>
                    {address.flat_no && `${address.flat_no}, `}
                    {address.building_name && `${address.building_name}, `}
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>Recent Orders</h2>
          {orders.length === 0 ? (
            <p style={s.emptyText}>No orders yet.</p>
          ) : (
            <div style={s.list}>
              {orders.slice(0, 4).map((order) => (
                <div key={order.order_id} style={s.listItem}>
                  <div style={s.orderRow}>
                    <p style={s.listTitle}>Order #{order.order_id}</p>
                    <span style={{ ...s.status, ...s.statusMap[order.status] }}>{order.status}</span>
                  </div>
                  <p style={s.listText}>{order.items?.length || 0} item(s) · ₹{Number(order.total_amount || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: '1120px', margin: '0 auto', padding: '28px 20px 40px' },
  header: { marginBottom: '20px' },
  title: { fontSize: '28px', color: '#111827', fontWeight: 700, marginBottom: '6px' },
  sub: { color: '#6B7280', fontSize: '14px' },
  loading: { maxWidth: '980px', margin: '30px auto', color: '#6B7280' },
  topGrid: { display: 'grid', gridTemplateColumns: '1.35fr 0.9fr', gap: '16px', marginBottom: '16px' },
  profileHero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #0ea5e9 100%)',
    borderRadius: '18px',
    color: '#fff',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 10px 28px rgba(15,23,42,0.14)',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 800,
    border: '1px solid rgba(255,255,255,0.22)',
  },
  heroLabel: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8, marginBottom: '4px' },
  heroName: { fontSize: '26px', marginBottom: '4px' },
  heroMeta: { fontSize: '13px', opacity: 0.9, marginBottom: '2px' },
  quickStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  statBox: {
    background: '#fff',
    border: '1px solid #E4E7EC',
    borderRadius: '16px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    justifyContent: 'center',
  },
  statNum: { fontSize: '24px', fontWeight: 800, color: '#111827' },
  statText: { fontSize: '12px', color: '#6B7280', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '16px' },
  bottomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' },
  card: { background: '#fff', border: '1px solid #E4E7EC', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 14px rgba(15,23,42,0.04)' },
  cardTitle: { fontSize: '18px', color: '#111827', marginBottom: '8px', fontWeight: 700 },
  meta: { color: '#9CA3AF', fontSize: '12px', marginBottom: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '13px', color: '#374151', fontWeight: 600 },
  input: {
    border: '1.5px solid #E4E7EC',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    color: '#111827',
    background: '#fff',
    fontFamily: 'Outfit, sans-serif',
  },
  primaryBtn: {
    marginTop: '6px',
    border: 'none',
    borderRadius: '8px',
    background: '#4F46E5',
    color: '#fff',
    padding: '11px 12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  secondaryBtn: {
    marginTop: '6px',
    border: '1px solid #4F46E5',
    borderRadius: '8px',
    background: '#EEF2FF',
    color: '#3730A3',
    padding: '11px 12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { border: '1px solid #EEF2F7', borderRadius: '12px', padding: '12px 14px', background: '#FAFBFF' },
  listTitle: { fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '4px' },
  listText: { fontSize: '13px', color: '#6B7280', lineHeight: 1.5 },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
  status: {
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'capitalize',
  },
  statusMap: {
    pending: { background: '#FEF3C7', color: '#B45309' },
    confirmed: { background: '#EEF2FF', color: '#4338CA' },
    shipped: { background: '#E0F2FE', color: '#0369A1' },
    delivered: { background: '#F0FDF4', color: '#047857' },
    cancelled: { background: '#FEF2F2', color: '#B91C1C' },
  },
  emptyText: { color: '#6B7280', fontSize: '13px' },
  success: {
    border: '1px solid #BBF7D0',
    background: '#F0FDF4',
    color: '#166534',
    borderRadius: '10px',
    padding: '10px 12px',
    marginBottom: '14px',
    fontSize: '13px',
  },
  error: {
    border: '1px solid #FECACA',
    background: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '10px',
    padding: '10px 12px',
    marginBottom: '14px',
    fontSize: '13px',
  },
  tip: { marginTop: '10px', color: '#6B7280', fontSize: '12px' },
};
