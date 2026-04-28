


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const PAYMENT_OPTIONS = [
  { value: 'upi',         label: 'UPI',              desc: 'GPay, PhonePe, Paytm',   icon: '📲', color: '#7C3AED' },
  { value: 'credit_card', label: 'Credit Card',      desc: 'Visa, Mastercard, Amex', icon: '💳', color: '#0284C7' },
  { value: 'debit_card',  label: 'Debit Card',       desc: 'All major banks',        icon: '🏦', color: '#059669' },
  { value: 'cash',        label: 'Cash on Delivery', desc: 'Pay when it arrives',    icon: '💵', color: '#D97706' },
];

export default function Checkout() {
  const [addresses, setAddresses]         = useState([]);
  const [selectedAddr, setSelectedAddr]   = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [newAddr, setNewAddr]             = useState({ flat_no: '', building_name: '', city: '', state: '', pincode: '' });
  const [showAddrForm, setShowAddrForm]   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [step, setStep]                   = useState(1);

  const navigate    = useNavigate();
  const getUserData = () => JSON.parse(localStorage.getItem('user') || '{}');
  const cart        = JSON.parse(localStorage.getItem('cart') || '[]');
  const subtotal    = cart.reduce((s, i) => s + i.product_price * i.quantity, 0);
  const delivery    = subtotal > 500 ? 0 : 49;
  const finalTotal  = subtotal + delivery;

  useEffect(() => {
    const u = getUserData();
    if (u.id) fetchAddresses(u.id);
  }, []); // eslint-disable-line

  const fetchAddresses = async (userId) => {
    try {
      const { data } = await API.get(`/address/${userId}`);
      setAddresses(data);
      if (data.length > 0) setSelectedAddr(data[0].address_id);
    } catch (err) { console.error(err); }
  };

  const addAddress = async () => {
    const u = getUserData();
    if (!u.id) return alert('Please login again to continue.');
    if (!newAddr.city || !newAddr.state || !newAddr.pincode)
      return alert('City, State and Pincode are required!');
    try {
      await API.post('/address', { user_id: u.id, ...newAddr });
      setShowAddrForm(false);
      setNewAddr({ flat_no: '', building_name: '', city: '', state: '', pincode: '' });
      fetchAddresses(u.id);
    } catch (err) { alert(err.response?.data?.error || 'Failed to add address'); }
  };

  const handleCheckout = async () => {
    const u = getUserData();
    if (!u.id) return alert('Please login again to continue.');
    if (!selectedAddr) return alert('Please select a delivery address!');
    setLoading(true);
    try {
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.product_price }));
      const { data: orderData } = await API.post('/orders', { items, final_amount: finalTotal, address_id: selectedAddr });
      // Payment no longer needs address_id
      await API.post('/payment', { order_id: orderData.order_id, payment_method: paymentMethod });
      localStorage.removeItem('cart');
      alert('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed');
    } finally { setLoading(false); }
  };

  const STEPS = [
    { label: 'Address', icon: '📍' },
    { label: 'Payment', icon: '💳' },
    { label: 'Review',  icon: '✅' },
  ];

  const selectedPayment = PAYMENT_OPTIONS.find(p => p.value === paymentMethod);

  return (
    <div style={s.page}>
      <h1 style={s.title}>🛒 Checkout</h1>

      {/* Steps */}
      <div style={s.steps}>
        {STEPS.map(({ label, icon }, i) => (
          <div key={label} style={s.stepItem}>
            <div style={{ ...s.stepCircle, ...(step > i + 1 ? s.stepDone : step === i + 1 ? s.stepActive : s.stepInactive) }}>
              {step > i + 1 ? '✓' : icon}
            </div>
            <span style={{ ...s.stepLabel, color: step === i + 1 ? '#4F46E5' : step > i + 1 ? '#059669' : '#9CA3AF' }}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div style={{ ...s.stepLine, background: step > i + 1 ? '#4F46E5' : '#E4E7EC' }} />}
          </div>
        ))}
      </div>

      <div style={s.layout}>
        <div style={s.main}>

          {/* STEP 1 — Address */}
          {step === 1 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>📍 Delivery Address</h2>
              {addresses.length === 0 && !showAddrForm && (
                <p style={s.noAddr}>🏠 No saved addresses. Add one below.</p>
              )}
              <div style={s.addrList}>
                {addresses.map((a, i) => (
                  <label key={a.address_id} style={{ ...s.addrCard, ...(selectedAddr === a.address_id ? s.addrActive : {}) }}>
                    <input type="radio" name="addr" checked={selectedAddr === a.address_id}
                      onChange={() => setSelectedAddr(a.address_id)} style={{ accentColor: '#4F46E5' }} />
                    <span style={s.addrIcon}>🏠</span>
                    <div>
                      <p style={s.addrLine1}>
                        {a.flat_no && `${a.flat_no}, `}{a.building_name && `${a.building_name}, `}{a.city}
                      </p>
                      <p style={s.addrLine2}>📌 {a.state} — {a.pincode}</p>
                    </div>
                    {selectedAddr === a.address_id && <span style={s.addrCheck}>✓</span>}
                  </label>
                ))}
              </div>

              <button style={s.addAddrBtn} onClick={() => setShowAddrForm(!showAddrForm)}>
                {showAddrForm ? '✕ Cancel' : '➕ Add new address'}
              </button>

              {showAddrForm && (
                <div style={s.addrForm}>
                  {[
                    { k: 'flat_no',       ph: '🏢 Flat No (optional)' },
                    { k: 'building_name', ph: '🏗️ Building Name (optional)' },
                    { k: 'city',          ph: '🌆 City *' },
                    { k: 'state',         ph: '📍 State *' },
                    { k: 'pincode',       ph: '📮 Pincode *' },
                  ].map(({ k, ph }) => (
                    <input key={k} style={s.addrInput} placeholder={ph}
                      value={newAddr[k]} onChange={e => setNewAddr({ ...newAddr, [k]: e.target.value })} />
                  ))}
                  <button style={s.saveAddrBtn} onClick={addAddress}>💾 Save Address</button>
                </div>
              )}
              <button style={{ ...s.nextBtn, opacity: !selectedAddr ? 0.6 : 1 }} onClick={() => setStep(2)} disabled={!selectedAddr}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>💳 Payment Method</h2>
              <div style={s.payList}>
                {PAYMENT_OPTIONS.map(({ value, label, desc, icon, color }) => (
                  <label key={value} style={{ ...s.payCard, ...(paymentMethod === value ? s.payActive : {}) }}>
                    <input type="radio" name="pay" value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)} style={{ accentColor: '#4F46E5' }} />
                    <div style={{ ...s.payIconBox, background: color + '15', border: `1px solid ${color}30` }}>
                      <span style={{ fontSize: '22px' }}>{icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={s.payLabel}>{label}</p>
                      <p style={s.payDesc}>{desc}</p>
                    </div>
                    {paymentMethod === value && <span style={s.payCheck}>✓</span>}
                  </label>
                ))}
              </div>
              <div style={s.btnRow}>
                <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
                <button style={s.nextBtn2} onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div style={s.section}>
              <h2 style={s.sectionTitle}>✅ Review & Place Order</h2>

              {addresses.filter(a => a.address_id === selectedAddr).map(a => (
                <div key={a.address_id} style={s.reviewBox}>
                  <p style={s.reviewLabel}>📍 Delivering to</p>
                  <p style={s.reviewValue}>
                    {a.flat_no && `${a.flat_no}, `}{a.building_name && `${a.building_name}, `}
                    {a.city}, {a.state} — {a.pincode}
                  </p>
                </div>
              ))}

              <div style={s.reviewBox}>
                <p style={s.reviewLabel}>💳 Payment via</p>
                <div style={s.reviewPayRow}>
                  <span style={{ fontSize: '20px' }}>{selectedPayment?.icon}</span>
                  <p style={s.reviewValue}>{selectedPayment?.label}</p>
                  <span style={s.reviewPayDesc}>{selectedPayment?.desc}</span>
                </div>
              </div>

              <div style={{ ...s.reviewBox, background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <p style={s.reviewLabel}>💰 Amount Payable</p>
                <p style={{ ...s.reviewValue, fontSize: '24px', fontWeight: '800', color: '#4F46E5' }}>
                  ₹{finalTotal.toLocaleString()}
                </p>
              </div>

              <div style={s.btnRow}>
                <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
                <button style={{ ...s.placeBtn, opacity: loading ? 0.75 : 1 }} onClick={handleCheckout} disabled={loading}>
                  {loading ? '⏳ Placing order...' : '🎉 Place Order & Pay'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <h3 style={s.sideTitle}>🧾 Order Summary</h3>
          {cart.map(i => (
            <div key={i.product_id} style={s.sideRow}>
              <span style={s.sideName}>{i.product_name} <span style={{ color: '#9CA3AF' }}>×{i.quantity}</span></span>
              <span style={s.sideAmt}>₹{(i.product_price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={s.sideDivider} />
          <div style={s.sideRow}>
            <span style={s.sideMuted}>🏷️ Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div style={s.sideRow}>
            <span style={s.sideMuted}>🚚 Delivery</span>
            <span style={delivery === 0 ? { color: '#059669', fontWeight: '600' } : {}}>
              {delivery === 0 ? '🎉 Free' : `₹${delivery}`}
            </span>
          </div>
          <div style={s.sideDivider} />
          <div style={s.sideTotal}>
            <span style={{ fontWeight: '600' }}>💰 Total</span>
            <span style={s.sideTotalAmt}>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:     { padding: '36px 40px', maxWidth: '1100px', margin: '0 auto' },
  title:    { fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px' },
  steps: {
    display: 'flex', alignItems: 'center', background: 'white',
    padding: '18px 24px', borderRadius: '10px', border: '1px solid #E4E7EC',
    marginBottom: '24px',
  },
  stepItem:     { display: 'flex', alignItems: 'center', gap: '8px', flex: 1 },
  stepCircle: {
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '700', flexShrink: 0,
  },
  stepActive:   { background: '#4F46E5', color: 'white' },
  stepDone:     { background: '#059669', color: 'white' },
  stepInactive: { background: '#F3F4F6', color: '#9CA3AF' },
  stepLabel:    { fontSize: '13px', fontWeight: '600' },
  stepLine:     { flex: 1, height: '2px', margin: '0 8px', borderRadius: '2px' },
  layout:       { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' },
  section:      { background: 'white', borderRadius: '12px', padding: '28px', border: '1px solid #E4E7EC' },
  sectionTitle: { fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '20px' },
  noAddr: {
    background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: '8px',
    padding: '14px', textAlign: 'center', color: '#6B7280', fontSize: '13px', marginBottom: '14px',
  },
  addrList:   { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' },
  addrCard: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
    border: '1.5px solid #E4E7EC', borderRadius: '10px', cursor: 'pointer',
  },
  addrActive:  { borderColor: '#4F46E5', background: '#EEF2FF' },
  addrIcon:    { fontSize: '20px' },
  addrLine1:   { fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '3px' },
  addrLine2:   { fontSize: '12px', color: '#6B7280' },
  addrCheck: {
    marginLeft: 'auto', width: '22px', height: '22px', borderRadius: '50%',
    background: '#4F46E5', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700', flexShrink: 0,
  },
  addAddrBtn: {
    background: 'none', border: '1px dashed #D1D5DB', borderRadius: '8px',
    padding: '9px 14px', cursor: 'pointer', color: '#4F46E5',
    fontSize: '13px', fontWeight: '500', marginBottom: '16px',
    fontFamily: 'Outfit, sans-serif',
  },
  addrForm: {
    background: '#F9FAFB', borderRadius: '8px', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px',
  },
  addrInput: {
    padding: '10px 12px', border: '1.5px solid #E4E7EC', borderRadius: '8px',
    fontSize: '13px', outline: 'none', fontFamily: 'Outfit, sans-serif',
    background: 'white', color: '#111827',
  },
  saveAddrBtn: {
    padding: '10px', background: '#4F46E5', border: 'none', borderRadius: '8px',
    color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  nextBtn: {
    width: '100%', padding: '12px', background: '#4F46E5', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px', fontFamily: 'Outfit, sans-serif',
  },
  payList:     { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  payCard: {
    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
    border: '1.5px solid #E4E7EC', borderRadius: '10px', cursor: 'pointer',
  },
  payActive:   { borderColor: '#4F46E5', background: '#EEF2FF' },
  payIconBox: {
    width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  payLabel:    { fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' },
  payDesc:     { fontSize: '12px', color: '#6B7280' },
  payCheck: {
    marginLeft: 'auto', width: '22px', height: '22px', borderRadius: '50%',
    background: '#4F46E5', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700', flexShrink: 0,
  },
  btnRow:      { display: 'flex', gap: '10px' },
  backBtn: {
    flex: 1, padding: '11px', background: 'white', border: '1px solid #E4E7EC',
    borderRadius: '8px', color: '#6B7280', fontSize: '13px', cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  nextBtn2: {
    flex: 2, padding: '11px', background: '#4F46E5', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  },
  reviewBox:    { background: '#F9FAFB', borderRadius: '10px', padding: '16px', marginBottom: '12px' },
  reviewLabel:  { fontSize: '11px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  reviewPayRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  reviewValue:  { fontSize: '15px', fontWeight: '600', color: '#111827' },
  reviewPayDesc:{ fontSize: '12px', color: '#9CA3AF', marginLeft: '4px' },
  placeBtn: {
    flex: 2, padding: '11px', background: '#4F46E5', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  },
  sidebar: {
    background: 'white', borderRadius: '12px', padding: '22px',
    border: '1px solid #E4E7EC', position: 'sticky', top: '80px',
  },
  sideTitle:    { fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '16px' },
  sideRow: {
    display: 'flex', justifyContent: 'space-between', fontSize: '13px',
    color: '#374151', marginBottom: '10px',
  },
  sideName:     { color: '#6B7280', maxWidth: '160px', lineHeight: 1.4 },
  sideAmt:      { fontWeight: '600', color: '#111827' },
  sideMuted:    { color: '#6B7280' },
  sideDivider:  { height: '1px', background: '#F3F4F6', margin: '12px 0' },
  sideTotal:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sideTotalAmt: { fontSize: '20px', fontWeight: '700', color: '#111827' },
};












