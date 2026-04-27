

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ICONS = ['🎧','⌨️','🔌','💻','📷','🖥️','🖱️','📱','🎮','⌚'];

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), []);

  const updateQty = (id, delta) => {
    const updated = cart.map(i => i.product_id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const remove = (id) => {
    const updated = cart.filter(i => i.product_id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const totalItems    = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal      = cart.reduce((s, i) => s + i.product_price * i.quantity, 0);
  const delivery      = subtotal > 500 ? 0 : 49;
  const total         = subtotal + delivery;
  const mostExpensive = cart.length > 0 ? cart.reduce((a, b) => a.product_price > b.product_price ? a : b) : null;

  if (cart.length === 0)
    return (
      <div style={s.emptyPage}>
        <p style={{ fontSize: '56px' }}>🛒</p>
        <h2 style={s.emptyTitle}>Your cart is empty</h2>
        <p style={s.emptySub}>Browse our products and add something you like</p>
        <button style={s.shopBtn} onClick={() => navigate('/products')}>🏪 Browse Products</button>
      </div>
    );

  return (
    <div style={s.page}>
      <h1 style={s.title}>🛒 Your Cart <span style={s.countTag}>{cart.length} items</span></h1>

      <div style={s.layout}>
        {/* Items List */}
        <div style={s.items}>
          {cart.map((item, idx) => (
            <div key={item.product_id} style={s.row}>
              <div style={s.rowIcon}>{ICONS[idx % ICONS.length]}</div>
              <div style={s.rowInfo}>
                <p style={s.rowName}>{item.product_name}</p>
                <p style={s.rowPrice}>💰 ₹{parseFloat(item.product_price).toLocaleString()} each</p>
              </div>
              <div style={s.qtyWrap}>
                <button style={s.qtyBtn} onClick={() => updateQty(item.product_id, -1)}>−</button>
                <span style={s.qty}>{item.quantity}</span>
                <button style={s.qtyBtn} onClick={() => updateQty(item.product_id, +1)}>+</button>
              </div>
              <p style={s.lineTotal}>₹{(item.product_price * item.quantity).toLocaleString()}</p>
              <button style={s.removeBtn} onClick={() => remove(item.product_id)}>🗑️</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>🧾 Order Summary</h3>

          {/* Customer Info */}
          <div style={s.infoBox}>
            <div style={s.infoRow}>
              <span style={s.infoIcon}>👤</span>
              <div>
                <p style={s.infoLabel}>Customer</p>
                <p style={s.infoValue}>{user.username || 'Guest'}</p>
              </div>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoIcon}>📧</span>
              <div>
                <p style={s.infoLabel}>Email</p>
                <p style={s.infoValue}>{user.email || '—'}</p>
              </div>
            </div>
          </div>

          <div style={s.divider} />

          {/* Item Breakdown */}
          <p style={s.sectionLabel}>📦 Items Breakdown</p>
          <div style={s.breakdownList}>
            {cart.map((item, idx) => (
              <div key={item.product_id} style={s.breakdownRow}>
                <span style={s.breakdownName}>
                  {ICONS[idx % ICONS.length]} {item.product_name}
                </span>
                <span style={s.breakdownCalc}>
                  {item.quantity} × ₹{parseFloat(item.product_price).toLocaleString()}
                </span>
                <span style={s.breakdownTotal}>
                  ₹{(item.product_price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div style={s.divider} />

          {/* Stats */}
          <p style={s.sectionLabel}>📊 Cart Stats</p>
          <div style={s.statsGrid}>
            <div style={s.statBox}>
              <p style={s.statVal}>{cart.length}</p>
              <p style={s.statLabel}>Products</p>
            </div>
            <div style={s.statBox}>
              <p style={s.statVal}>{totalItems}</p>
              <p style={s.statLabel}>Total Units</p>
            </div>
            <div style={s.statBox}>
              <p style={s.statVal}>₹{Math.round(subtotal / totalItems).toLocaleString()}</p>
              <p style={s.statLabel}>Avg Price</p>
            </div>
          </div>
{/* 
          {mostExpensive && (
            <div style={s.highlightBox}>
              <span>⭐</span>
              <div>
                <p style={s.highlightLabel}>Most Expensive Item</p>
                <p style={s.highlightVal}>{mostExpensive.product_name} — ₹{parseFloat(mostExpensive.product_price).toLocaleString()}</p>
              </div>
            </div>
          )} */}

          <div style={s.divider} />

          {/* Price Summary */}
          <p style={s.sectionLabel}>💳 Price Details</p>
          <div style={s.summaryRows}>
            <div style={s.sRow}>
              <span>🏷️ Subtotal ({totalItems} units)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={s.sRow}>
              <span>🚚 Delivery Charges</span>
              <span>
                {delivery === 0
                  ? <span style={{ color: '#059669', fontWeight: '600' }}>FREE</span>
                  : `₹${delivery}`}
              </span>
            </div>
            {delivery > 0 && (
              <div style={s.freeHint}>
                💡 Add ₹{(500 - subtotal + 1).toLocaleString()} more for free delivery
              </div>
            )}
          </div>

          <div style={s.divider} />

          <div style={s.totalRow}>
            <span>💰 Amount Payable</span>
            <span style={s.totalAmt}>₹{total.toLocaleString()}</span>
          </div>

          {delivery === 0 && (
            <p style={s.freeMsg}>✅ You got free delivery!</p>
          )}

          {/* Delivery Info */}
          <div style={s.deliveryInfo}>
            <div style={s.deliveryRow}><span>🕐</span><span>Estimated delivery: 3–5 business days</span></div>
            <div style={s.deliveryRow}><span>🔒</span><span>Secure & encrypted checkout</span></div>
            <div style={s.deliveryRow}><span>↩️</span><span>Easy 7-day returns</span></div>
          </div>

          <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <button style={s.continueBtn} onClick={() => navigate('/products')}>
            🏪 Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:     { padding: '36px 40px', maxWidth: '1200px', margin: '0 auto' },
  title: {
    fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px',
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  countTag: {
    background: '#EEF2FF', color: '#4F46E5', fontSize: '13px',
    fontWeight: '600', padding: '3px 12px', borderRadius: '20px',
  },
  layout:  { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' },
  items:   { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: {
    display: 'flex', alignItems: 'center', gap: '16px',
    background: 'white', padding: '16px 20px', borderRadius: '12px',
    border: '1px solid #E4E7EC',
  },
  rowIcon:  { fontSize: '32px', width: '48px', textAlign: 'center' },
  rowInfo:  { flex: 1 },
  rowName:  { fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' },
  rowPrice: { fontSize: '13px', color: '#6B7280' },
  qtyWrap:  { display: 'flex', alignItems: 'center', border: '1px solid #E4E7EC', borderRadius: '8px', overflow: 'hidden' },
  qtyBtn: {
    width: '32px', height: '32px', border: 'none', background: '#F9FAFB',
    fontSize: '16px', cursor: 'pointer', color: '#374151',
  },
  qty: {
    width: '36px', textAlign: 'center', fontSize: '14px', fontWeight: '600',
    color: '#111827', borderLeft: '1px solid #E4E7EC', borderRight: '1px solid #E4E7EC',
    lineHeight: '32px',
  },
  lineTotal: { fontWeight: '700', color: '#4F46E5', fontSize: '16px', minWidth: '80px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' },

  /* Summary Box */
  summary: {
    background: 'white', borderRadius: '14px', padding: '24px',
    border: '1px solid #E4E7EC', position: 'sticky', top: '80px',
  },
  summaryTitle: { fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' },

  /* Customer Info */
  infoBox: {
    background: '#F9FAFB', borderRadius: '10px', padding: '12px 14px',
    display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px',
  },
  infoRow:   { display: 'flex', alignItems: 'center', gap: '10px' },
  infoIcon:  { fontSize: '18px' },
  infoLabel: { fontSize: '10px', color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoValue: { fontSize: '13px', fontWeight: '600', color: '#111827' },

  /* Breakdown */
  sectionLabel: { fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' },
  breakdownList: { display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '4px' },
  breakdownRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: '12px', gap: '6px',
  },
  breakdownName:  { color: '#374151', flex: 1, fontWeight: '500' },
  breakdownCalc:  { color: '#9CA3AF', flexShrink: 0 },
  breakdownTotal: { color: '#4F46E5', fontWeight: '700', flexShrink: 0, minWidth: '60px', textAlign: 'right' },

  /* Stats */
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px',
  },
  statBox: {
    background: '#EEF2FF', borderRadius: '8px', padding: '10px 8px', textAlign: 'center',
  },
  statVal:   { fontSize: '15px', fontWeight: '800', color: '#4F46E5', marginBottom: '2px' },
  statLabel: { fontSize: '10px', color: '#6B7280', fontWeight: '500' },

  /* Highlight */
  highlightBox: {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    background: '#FFFBEB', border: '1px solid #FDE68A',
    borderRadius: '8px', padding: '10px 12px', marginBottom: '4px',
    fontSize: '12px',
  },
  highlightLabel: { color: '#92400E', fontWeight: '600', marginBottom: '2px', fontSize: '11px' },
  highlightVal:   { color: '#111827', fontWeight: '500' },

  /* Price rows */
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' },
  sRow:        { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280' },
  freeHint: {
    background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8',
    padding: '8px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500',
  },

  divider:  { height: '1px', background: '#F3F4F6', margin: '14px 0' },
  totalRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: '#111827',
  },
  totalAmt: { fontSize: '22px', fontWeight: '800', color: '#111827' },
  freeMsg: {
    background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#059669',
    padding: '9px 12px', borderRadius: '8px', fontSize: '12px',
    textAlign: 'center', marginBottom: '12px', fontWeight: '600',
  },

  /* Delivery Info */
  deliveryInfo: {
    background: '#F9FAFB', borderRadius: '8px', padding: '12px 14px',
    display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px',
  },
  deliveryRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '12px', color: '#6B7280',
  },

  checkoutBtn: {
    width: '100%', padding: '12px', background: '#4F46E5', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: '8px',
  },
  continueBtn: {
    width: '100%', padding: '11px', background: 'transparent',
    border: '1px solid #E4E7EC', borderRadius: '8px', color: '#6B7280',
    fontSize: '13px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  },

  emptyPage:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '12px', textAlign: 'center' },
  emptyTitle: { fontSize: '22px', fontWeight: '700', color: '#111827' },
  emptySub:   { fontSize: '14px', color: '#6B7280', maxWidth: '280px' },
  shopBtn: {
    marginTop: '8px', padding: '11px 24px', background: '#4F46E5', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  },
};



