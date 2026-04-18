import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const PRODUCT_ICONS = ['🎧', '⌨️', '🔌', '💻', '📷', '🖥️', '🖱️', '📱', '🎮', '⌚'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActive] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [added, setAdded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);

    if (!q.trim()) {
      return fetchProducts();
    }

    try {
      const { data } = await API.get(`/products?q=${encodeURIComponent(q)}`);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.product_id === product.product_id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    setAdded(product.product_id);

    setTimeout(() => setAdded(null), 1500);
  };

  const getProductImage = (name) => {
    const value = (name || '').toLowerCase();

    // Using 100% reliable, permanent Wikimedia images to avoid any hotlinking or 404 errors
    if (value.includes('wireless headphones'))
      return 'https://i.pinimg.com/1200x/6e/86/d5/6e86d534300404b64375739e18064a77.jpg';
    if (value.includes('mechanical keyboard'))
      return 'https://i.pinimg.com/1200x/1f/23/0e/1f230e9173df9cc31ccf608c180190fe.jpg'; // Literal Model M mechanical keyboard photograph
    if (value.includes('usb-c hub'))
      return 'https://upload.wikimedia.org/wikipedia/commons/4/46/USB_hub.jpg';
    if (value.includes('laptop stand'))
      return 'https://i.pinimg.com/736x/25/3b/fa/253bfadfb3008ea04e8148202d33b132.jpg'; // Literal laptop mounting table/stand
    if (value.includes('webcam'))
      return 'https://i.pinimg.com/736x/82/9a/28/829a28dcf7580b6f9935a85f078b6ec0.jpg';
    // General fallback categories
    if (value.includes('laptop'))
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop';
    if (value.includes('phone') || value.includes('mobile'))
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop';
    if (value.includes('watch'))
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop';

    return 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop';
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <p style={s.heroTag}>🛍️ Welcome to ShopEasy</p>
          <h1 style={s.heroTitle}>
            Find Everything
            <br />
            You Need
          </h1>
          <p style={s.heroSub}>Browse our curated collection of top products</p>

          <div style={s.heroSearch}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div style={{ ...s.floatEmoji, top: '20%', right: '10%', fontSize: '48px', opacity: 0.15 }}>💻</div>
        <div style={{ ...s.floatEmoji, top: '55%', right: '20%', fontSize: '36px', opacity: 0.12 }}>🎧</div>
        <div style={{ ...s.floatEmoji, top: '25%', right: '30%', fontSize: '28px', opacity: 0.10 }}>📱</div>
      </div>

      <div style={s.body}>
        {loading ? (
          <div style={s.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={s.skeleton} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <p style={{ fontSize: '48px' }}>🔍</p>
            <p style={s.emptyText}>No products found</p>
            <p style={s.emptySub}>Try a different search or category</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((product) => (
              <div key={product.product_id} style={s.card}>
                <div style={s.imageBox}>
                  <img
                    src={getProductImage(product.product_name)}
                    alt={product.product_name}
                    style={s.productImage}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop';
                      e.target.style.objectFit = 'contain';
                    }}
                  />

                  {product.stock === 0 && <span style={s.oosBadge}>Out of stock</span>}
                  {product.stock > 0 && product.stock <= 10 && (
                    <span style={s.lowBadge}>⚡ Low stock</span>
                  )}
                </div>

                <div style={s.cardBody}>
                  <p style={s.name}>{product.product_name}</p>

                  <div style={s.priceRow}>
                    <p style={s.price}>
                      ₹{parseFloat(product.product_price).toLocaleString()}
                    </p>
                    <span
                      style={{
                        ...s.stockDot,
                        background: product.stock > 0 ? '#059669' : '#DC2626',
                      }}
                    />
                  </div>

                  <p style={s.stockText}>
                    {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Unavailable'}
                  </p>
                </div>

                <button
                  style={{
                    ...s.addBtn,
                    ...(product.stock === 0 ? s.addBtnDisabled : {}),
                    ...(added === product.product_id ? s.addBtnAdded : {}),
                  }}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {added === product.product_id
                    ? '✅ Added to cart!'
                    : product.stock === 0
                    ? '❌ Out of stock'
                    : '🛒 Add to cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <button style={s.floatCart} onClick={() => navigate('/cart')}>
          🛒 View Cart
          <span style={s.floatBadge}>{cartCount}</span>
        </button>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#F5F6FA' },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #4338CA 100%)',
    padding: '60px 40px 70px',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: '600px' },
  heroTag: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '12px',
    letterSpacing: '0.3px',
  },
  heroTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '42px',
    fontWeight: '800',
    color: 'white',
    lineHeight: 1.2,
    marginBottom: '10px',
  },
  heroSub: { fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '28px' },
  heroSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'white',
    borderRadius: '12px',
    padding: '4px 16px',
    maxWidth: '480px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  searchIcon: { fontSize: '16px' },
  searchInput: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    fontFamily: 'Outfit, sans-serif',
    color: '#111827',
    background: 'transparent',
  },
  floatEmoji: { position: 'absolute', pointerEvents: 'none', userSelect: 'none' },

  body: { padding: '32px 40px', maxWidth: '1200px', margin: '0 auto' },
  catRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '8px 16px',
    borderRadius: '50px',
    border: '1.5px solid #E4E7EC',
    background: 'white',
    color: '#6B7280',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    transition: 'all 0.15s',
  },
  catBtnActive: {
    background: '#4F46E5',
    borderColor: '#4F46E5',
    color: 'white',
    fontWeight: '600',
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#111827' },
  countTag: {
    background: '#EEF2FF',
    color: '#4F46E5',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    background: 'white',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #E4E7EC',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.2s',
  },
  imageBox: {
    height: '180px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '12px',
    borderBottom: '1px solid #E4E7EC',
  },
  productImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  lowBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#FEF3C7',
    color: '#D97706',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '20px',
  },
  oosBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#FEF2F2',
    color: '#DC2626',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '20px',
  },
  cardBody: { padding: '16px 16px 10px', flex: 1 },
  name: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
    lineHeight: 1.4,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  price: { fontSize: '19px', fontWeight: '700', color: '#4F46E5' },
  stockDot: { width: '8px', height: '8px', borderRadius: '50%' },
  stockText: { fontSize: '12px', color: '#9CA3AF' },
  orderedText: {
    fontSize: '11px',
    color: '#6B7280',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  addBtn: {
    margin: '0 16px 16px',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    background: '#4F46E5',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    transition: 'all 0.15s',
  },
  addBtnDisabled: { background: '#F3F4F6', color: '#9CA3AF', cursor: 'not-allowed' },
  addBtnAdded: { background: '#059669' },

  floatCart: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '13px 22px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  floatBadge: {
    background: 'white',
    color: '#4F46E5',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
  },

  skeleton: {
    height: '270px',
    borderRadius: '14px',
    border: '1px solid #E4E7EC',
    background: 'linear-gradient(90deg, #F5F6FA 25%, #ECEEF2 50%, #F5F6FA 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  empty: { textAlign: 'center', padding: '80px', color: '#9CA3AF' },
  emptyText: {
    marginTop: '12px',
    fontSize: '17px',
    fontWeight: '600',
    color: '#374151',
  },
  emptySub: { fontSize: '13px', marginTop: '6px' },
};