import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredProd, setHoveredProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [productImage, setProductImage] = useState(null);

  const [newProduct, setNewProduct] = useState({
    product_name: '',
    product_price: '',
    stock: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === 'pending').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      revenue: orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
      products: products.length,
    };
  }, [orders, products]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, productsRes] = await Promise.all([
        API.get('/orders/admin/all'),
        API.get('/products'),
      ]);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setError('');
    setMessage('');
    try {
      await API.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, status } : o)));
      setMessage(`Order #${orderId} updated to ${status}`);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to update order status');
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('product_name', newProduct.product_name.trim());
      formData.append('product_price', Number(newProduct.product_price));
      formData.append('stock', Number(newProduct.stock));
      if (productImage) {
        formData.append('image', productImage);
      }

      // Let the browser/axios set the Content-Type (includes multipart boundary)
      await API.post('/products', formData);
      setMessage('New product added successfully');
      setNewProduct({ product_name: '', product_price: '', stock: '' });
      setProductImage(null);
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div>
          <p style={s.heroTag}>Admin Dashboard</p>
          <h1 style={s.heroTitle}>Store Operations</h1>
          <p style={s.heroSub}>Manage incoming orders and your product catalog from one place.</p>
        </div>
        <button style={s.refreshBtn} onClick={fetchData}>Refresh Data</button>
      </div>

      {message && <div style={s.success}>{message}</div>}
      {error && <div style={s.error}>{error}</div>}

      <div style={s.statsGrid}>
        <div style={s.statCard}><p style={s.statLabel}>Pending Orders</p><p style={s.statVal}>{stats.pending}</p></div>
        <div style={s.statCard}><p style={s.statLabel}>Shipped Orders</p><p style={s.statVal}>{stats.shipped}</p></div>
        <div style={s.statCard}><p style={s.statLabel}>Total Revenue</p><p style={s.statVal}>Rs {Math.round(stats.revenue).toLocaleString()}</p></div>
        <div style={s.statCard}><p style={s.statLabel}>Products</p><p style={s.statVal}>{stats.products}</p></div>
      </div>

      <div style={s.mainGrid}>
        <section style={s.panel}>
          <h2 style={s.panelTitle}>Add New Product</h2>
          <form style={s.form} onSubmit={createProduct}>
            <label style={s.label}>Product Name</label>
            <input
              style={s.input}
              value={newProduct.product_name}
              onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
              required
            />

            <label style={s.label}>Price</label>
            <input
              style={s.input}
              type="number"
              min="0"
              step="0.01"
              value={newProduct.product_price}
              onChange={(e) => setNewProduct({ ...newProduct, product_price: e.target.value })}
              required
            />

            <label style={s.label}>Stock</label>
            <input
              style={s.input}
              type="number"
              min="0"
              step="1"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              required
            />

            <label style={s.label}>Product Image</label>
            <input
              style={s.fileInput}
              type="file"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files?.[0] || null)}
            />
            {productImage && (
              <div style={{ marginTop: 8 }}>
                <small style={{ color: '#374151' }}>Preview:</small>
                <div style={{ width: 120, height: 80, borderRadius: 8, overflow: 'hidden', marginTop: 6 }}>
                  <img
                    src={URL.createObjectURL(productImage)}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}

            <button style={s.primaryBtn}>Add Product</button>
          </form>
        </section>

        <section style={s.panelWide}>
          <h2 style={s.panelTitle}>Current Orders</h2>
          {loading ? (
            <p style={s.muted}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={s.muted}>No orders found.</p>
          ) : (
            <div style={s.orderList}>
              {orders.map((order) => (
                <div key={order.order_id} style={s.orderCard}>
                  <div style={s.orderHeader}>
                    <div>
                      <p style={s.orderId}>Order #{order.order_id}</p>
                      <p style={s.orderUser}>{order.user?.username} ({order.user?.email})</p>
                    </div>
                    <p style={s.orderAmt}>Rs {Number(order.total_amount).toLocaleString()}</p>
                  </div>

                  <div style={s.statusRow}>
                    <span style={s.statusPill}>{order.status}</span>
                    <select
                      style={s.select}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((sOpt) => (
                        <option key={sOpt} value={sOpt}>{sOpt}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.itemsWrap}>
                    {order.items?.slice(0, 3).map((item) => (
                      <p key={item.item_id} style={s.itemLine}>
                        {item.product_name} x {item.quantity}
                      </p>
                    ))}
                    {order.items?.length > 3 && <p style={s.more}>+{order.items.length - 3} more items</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section style={s.panel}>
        <h2 style={s.panelTitle}>Product Catalog</h2>
        {products.length === 0 ? (
          <p style={s.muted}>No products found.</p>
        ) : (
          <div style={s.productGrid}>
            {products.map((p) => (
              <div
                key={p.product_id}
                style={{
                  ...s.productCard,
                  transform: hoveredProd === p.product_id ? 'translateY(-6px)' : 'none',
                  boxShadow: hoveredProd === p.product_id ? '0 12px 30px rgba(2,6,23,0.06)' : 'none',
                }}
                onMouseEnter={() => setHoveredProd(p.product_id)}
                onMouseLeave={() => setHoveredProd(null)}
              >
                <div style={s.productImageWrap}>
                  <img
                    src={p.image_url || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop'}
                    alt={p.product_name}
                    style={{ ...s.productImage, transform: hoveredProd === p.product_id ? 'scale(1.04)' : 'scale(1)' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                </div>
                <p style={s.productName}>{p.product_name}</p>
                <p style={s.productMeta}>Rs {Number(p.product_price).toLocaleString()}</p>
                <p style={s.productMeta}>Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const s = {
  page: { maxWidth: '1160px', margin: '0 auto', padding: '22px 20px 40px' },
  hero: {
    borderRadius: '16px',
    padding: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    background: 'linear-gradient(120deg, #0b1220 0%, #0ea5e9 60%)',
    color: '#fff',
    marginBottom: '18px',
    boxShadow: '0 8px 30px rgba(2,6,23,0.12)',
  },
  heroTag: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 },
  heroTitle: { fontSize: '30px', marginBottom: '6px' },
  heroSub: { fontSize: '13px', opacity: 0.9 },
  refreshBtn: {
    border: '1px solid rgba(255,255,255,0.45)',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    borderRadius: '10px',
    padding: '10px 12px',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' },
  statCard: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px' },
  statLabel: { color: '#6B7280', fontSize: '12px', marginBottom: '6px' },
  statVal: { color: '#111827', fontWeight: 700, fontSize: '22px' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px', marginBottom: '12px' },
  panel: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' },
  panelWide: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', minHeight: '420px' },
  panelTitle: { fontSize: '18px', color: '#111827', marginBottom: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '9px' },
  label: { fontSize: '13px', color: '#374151', fontWeight: 600 },
  input: {
    border: '1.5px solid #E5E7EB',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
  },
  fileInput: {
    border: '1.5px dashed #CBD5E1',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    background: '#F8FAFC',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
  },
  primaryBtn: {
    marginTop: '6px',
    background: 'linear-gradient(90deg,#1D4ED8,#06B6D4)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 14px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    boxShadow: '0 8px 20px rgba(29,78,216,0.18)',
  },
  orderList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  orderCard: { border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', marginBottom: '8px' },
  orderId: { color: '#111827', fontWeight: 700, fontSize: '15px' },
  orderUser: { color: '#6B7280', fontSize: '12px' },
  orderAmt: { color: '#1D4ED8', fontWeight: 700 },
  statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  statusPill: {
    border: '1px solid #BFDBFE',
    background: '#EFF6FF',
    color: '#1D4ED8',
    borderRadius: '999px',
    padding: '4px 10px',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  select: {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '7px 10px',
    fontFamily: 'Outfit, sans-serif',
    fontSize: '13px',
  },
  itemsWrap: { background: '#F9FAFB', borderRadius: '8px', padding: '8px 10px' },
  itemLine: { fontSize: '13px', color: '#374151', marginBottom: '4px' },
  more: { color: '#6B7280', fontSize: '12px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' },
  productCard: { border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px' },
  productImageWrap: {
    width: '100%',
    height: '140px',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#F3F4F6',
    marginBottom: '10px',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.45s cubic-bezier(.2,.9,.2,1)',
  },

  productCardHover: {
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
  },
  productName: { color: '#111827', fontWeight: 600, marginBottom: '6px' },
  productMeta: { color: '#6B7280', fontSize: '13px' },
  muted: { color: '#6B7280', fontSize: '13px' },
  success: {
    border: '1px solid #BBF7D0',
    background: '#F0FDF4',
    color: '#166534',
    borderRadius: '10px',
    padding: '10px 12px',
    marginBottom: '12px',
    fontSize: '13px',
  },
  error: {
    border: '1px solid #FECACA',
    background: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '10px',
    padding: '10px 12px',
    marginBottom: '12px',
    fontSize: '13px',
  },
};
