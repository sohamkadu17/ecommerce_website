import { useState, useEffect } from 'react';
import API from '../api/axios';

const STATUS = {
  pending:   { label: '⏳ Pending',   color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  confirmed: { label: '✅ Confirmed', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
  shipped:   { label: '🚚 Shipped',   color: '#0284C7', bg: '#E0F2FE', border: '#BAE6FD' },
  delivered: { label: '📦 Delivered', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
  cancelled: { label: '❌ Cancelled', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
};

const PROGRESS = ['pending', 'confirmed', 'shipped', 'delivered'];
const PROGRESS_ICONS = ['⏳', '✅', '🚚', '📦'];

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get(`/orders/${user.id}`)
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  if (loading)
    return (
      <div style={s.page}>
        <h1 style={s.title}>📦 My Orders</h1>
        {[1,2,3].map(i => <div key={i} style={s.skeleton} />)}
      </div>
    );

  if (orders.length === 0)
    return (
      <div style={s.emptyPage}>
        <p style={{ fontSize: '56px' }}>📦</p>
        <h2 style={s.emptyTitle}>No orders yet</h2>
        <p style={s.emptySub}>Your order history will appear here</p>
      </div>
    );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>📦 My Orders</h1>
        <span style={s.count}>{orders.length} order{orders.length > 1 ? 's' : ''}</span>
      </div>

      <div style={s.list}>
        {orders.map(order => {
          const cfg = STATUS[order.status] || STATUS.pending;
          const progIdx = PROGRESS.indexOf(order.status);
          return (
            <div key={order.order_id} style={s.card}>
              {/* Header */}
              <div style={s.cardHead}>
                <div>
                  <p style={s.orderNum}>Order #{order.order_id}</p>
                  <p style={s.orderDate}>
                    🗓️ {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
                <span style={{ ...s.badge, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
              </div>

              {/* Progress Tracker */}
              {order.status !== 'cancelled' && (
                <div style={s.progress}>
                  {PROGRESS.map((step, i) => (
                    <div key={step} style={s.progStep}>
                      <div style={{ ...s.progDot, background: progIdx >= i ? '#4F46E5' : '#E4E7EC' }}>
                        <span style={{ fontSize: '12px' }}>{progIdx >= i ? PROGRESS_ICONS[i] : '○'}</span>
                      </div>
                      <span style={{ ...s.progLabel, color: progIdx >= i ? '#4F46E5' : '#9CA3AF', fontWeight: progIdx === i ? '700' : '400' }}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </span>
                      {i < PROGRESS.length - 1 && (
                        <div style={{ ...s.progLine, background: progIdx > i ? '#4F46E5' : '#E4E7EC' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Address */}
              {order.address && (
                <div style={s.addressBox}>
                  <span style={s.addressLabel}>📍 Delivery Address</span>
                  <p style={s.addressText}>
                    {order.address.flat_no && `${order.address.flat_no}, `}
                    {order.address.building_name && `${order.address.building_name}, `}
                    {order.address.city}, {order.address.state} — {order.address.pincode}
                  </p>
                </div>
              )}

              {/* Items */}
              <div style={s.items}>
                {order.items.map(item => (
                  <div key={item.item_id} style={s.item}>
                    <span style={s.itemName}>📦 {item.product_name}</span>
                    <span style={s.itemQty}>×{item.quantity}</span>
                    <span style={s.itemUnitPrice}>₹{parseFloat(item.unit_price).toLocaleString()} each</span>
                    <span style={s.itemPrice}>₹{parseFloat(item.total_price).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={s.cardFoot}>
                <span style={s.footNote}>🛍️ {order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                <span style={s.footTotal}>
                  💰 Total: <strong style={{ color: '#111827' }}>₹{parseFloat(order.total_amount).toLocaleString()}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page:    { padding: '36px 40px', maxWidth: '860px', margin: '0 auto' },
  header:  { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  title:   { fontSize: '24px', fontWeight: '700', color: '#111827' },
  count: {
    background: '#EEF2FF', color: '#4F46E5', fontSize: '13px',
    fontWeight: '600', padding: '3px 12px', borderRadius: '20px',
  },
  list:    { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    background: 'white', borderRadius: '14px', padding: '22px',
    border: '1px solid #E4E7EC', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  cardHead:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  orderNum:  { fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '3px' },
  orderDate: { fontSize: '12px', color: '#9CA3AF' },
  badge:     { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  progress: {
    display: 'flex', alignItems: 'flex-start', background: '#F9FAFB',
    borderRadius: '10px', padding: '14px 16px', marginBottom: '16px',
  },
  progStep:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flex: 1, position: 'relative' },
  progDot: {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  progLabel: { fontSize: '11px', textAlign: 'center' },
  progLine:  { position: 'absolute', top: '14px', left: '50%', width: '100%', height: '2px', zIndex: 0 },
  items:     { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  item: {
    display: 'flex', alignItems: 'center', padding: '9px 12px',
    background: '#F9FAFB', borderRadius: '8px', gap: '10px',
  },
  itemName:  { flex: 1, fontSize: '13px', color: '#374151', fontWeight: '500' },
  itemQty:   { fontSize: '12px', color: '#9CA3AF' },
  itemUnitPrice: { fontSize: '12px', color: '#9CA3AF' },
  itemPrice:    { fontSize: '13px', fontWeight: '600', color: '#4F46E5' },
  addressBox:   { background: '#F0F9FF', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' },
  addressLabel: { fontSize: '11px', fontWeight: '600', color: '#0369A1', display: 'block', marginBottom: '4px' },
  addressText:  { fontSize: '13px', color: '#0C4A6E', margin: 0 },
  cardFoot:     {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '14px', borderTop: '1px solid #F3F4F6',
    fontSize: '13px', color: '#6B7280',
  },
  footNote:  {},
  footTotal: {},
  skeleton: {
    height: '180px', borderRadius: '14px', border: '1px solid #E4E7EC',
    background: 'linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: '16px',
  },
  emptyPage:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '12px', textAlign: 'center' },
  emptyTitle: { fontSize: '22px', fontWeight: '700', color: '#111827' },
  emptySub:   { fontSize: '14px', color: '#6B7280' },
};