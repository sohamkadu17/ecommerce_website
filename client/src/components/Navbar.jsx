

import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem('token');
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin   = user.role === 'admin';
  const cart      = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const isActive  = (p) => location.pathname === p;

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const navLinks = [
    { path: '/products', label: 'Products', icon: '🏪' },
    ...(token && !isAdmin ? [{ path: '/orders', label: 'Orders', icon: '📦' }] : []),
    ...(token && !isAdmin ? [{ path: '/profile', label: 'Profile', icon: '👤' }] : []),
    ...(token && isAdmin ? [{ path: '/admin', label: 'Admin Panel', icon: '🛠️' }] : []),
  ];

  return (
    <nav style={s.nav}>
      <Link to="/products" style={s.brand}>
        <div style={s.brandIcon}>🛍</div>
        <span style={s.brandName}>ShopEasy</span>
      </Link>

      <div style={s.links}>
        {navLinks.map(({ path, label, icon }) => (
          <Link key={path} to={path} style={{ ...s.link, ...(isActive(path) ? s.linkActive : {}) }}>
            <span>{icon}</span><span>{label}</span>
          </Link>
        ))}
      </div>

      <div style={s.right}>
        {token && !isAdmin && (
          <Link to="/cart" style={{ ...s.cartBtn, ...(isActive('/cart') ? s.cartBtnActive : {}) }}>
            <span>🛒</span>
            <span>Cart</span>
            {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
          </Link>
        )}
        {token ? (
          <>
            <div style={s.userChip}>
              <div style={s.avatar}>{user.username?.[0]?.toUpperCase()}</div>
              <span style={s.username}>{user.username}</span>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>↩ Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={s.loginBtn}>👤 Login</Link>
            <Link to="/admin/login" style={s.loginBtn}>🛠️ Admin</Link>
            <Link to="/register" style={s.registerBtn}>✨ Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: '66px',
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(14px)',
    borderBottom: '2px solid #C7D2FE',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 6px 20px rgba(29,78,216,0.08)',
  },
  brand:     { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  brandIcon: {
    width: '36px', height: '36px', background: 'linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
    boxShadow: '0 6px 14px rgba(29,78,216,0.18)',
  },
  brandName: { fontWeight: '800', color: '#111827', fontSize: '18px' },
  links:     { display: 'flex', gap: '4px' },
  link: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '8px', textDecoration: 'none',
    color: '#6B7280', fontSize: '14px', fontWeight: '500',
  },
  linkActive:    { color: '#1D4ED8', background: '#EEF2FF', border: '1px solid #C7D2FE', fontWeight: '600' },
  right:         { display: 'flex', alignItems: 'center', gap: '8px' },
  cartBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', position: 'relative',
    padding: '8px 14px', borderRadius: '8px', textDecoration: 'none',
    color: '#6B7280', fontSize: '14px', fontWeight: '500',
    border: '1px solid #E4E7EC', background: 'white',
  },
  cartBtnActive: { color: '#4F46E5', background: '#EEF2FF', borderColor: '#C7D2FE' },
  cartBadge: {
    position: 'absolute', top: '-6px', right: '-6px',
    background: '#4F46E5', color: 'white', fontSize: '10px', fontWeight: '700',
    width: '18px', height: '18px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid white',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '5px 12px 5px 5px', borderRadius: '50px',
    background: '#F8FAFF', border: '1px solid #C7D2FE',
  },
  avatar: {
    width: '28px', height: '28px', borderRadius: '50%', background: '#4F46E5',
    color: 'white', fontWeight: '700', fontSize: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  username:  { fontSize: '13px', fontWeight: '600', color: '#374151' },
  logoutBtn: {
    padding: '7px 14px', border: '1px solid #E4E7EC', background: 'white',
    color: '#6B7280', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
    borderRadius: '8px', fontFamily: 'Outfit, sans-serif',
  },
  loginBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '7px 14px', border: '1px solid #C7D2FE', borderRadius: '8px',
    textDecoration: 'none', color: '#374151', fontSize: '13px', fontWeight: '500',
  },
  registerBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '7px 14px', background: 'linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)', borderRadius: '8px',
    textDecoration: 'none', color: 'white', fontSize: '13px', fontWeight: '600',
  },
};


// // import { Link, useNavigate } from 'react-router-dom';

// // function Navbar() {
// //   const navigate  = useNavigate();
// //   const token     = localStorage.getItem('token');
// //   const user      = JSON.parse(localStorage.getItem('user') || '{}');

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     localStorage.removeItem('cart');
// //     navigate('/login');
// //   };

// //   return (
// //     <nav style={styles.nav}>
// //       <Link to="/products" style={styles.brand}>🛒 ShopEasy</Link>
// //       <div style={styles.links}>
// //         <Link to="/products" style={styles.link}>Products</Link>
// //         {token ? (
// //           <>
// //             <Link to="/cart"   style={styles.link}>🛍️ Cart</Link>
// //             <Link to="/orders" style={styles.link}>📦 Orders</Link>
// //             <span style={styles.username}>Hi, {user.username}!</span>
// //             <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
// //           </>
// //         ) : (
// //           <>
// //             <Link to="/login"    style={styles.link}>Login</Link>
// //             <Link to="/register" style={styles.link}>Register</Link>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }

// // const styles = {
// //   nav:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
// //                padding: '12px 24px', background: '#1a1a2e', color: 'white' },
// //   brand:     { color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' },
// //   links:     { display: 'flex', alignItems: 'center', gap: '16px' },
// //   link:      { color: 'white', textDecoration: 'none', fontSize: '15px' },
// //   username:  { color: '#f0a500', fontSize: '14px' },
// //   logoutBtn: { background: '#e74c3c', color: 'white', border: 'none',
// //                padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' },
// // };

// // export default Navbar;

// import { Link, useNavigate, useLocation } from 'react-router-dom';

// export default function Navbar() {
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const token     = localStorage.getItem('token');
//   const user      = JSON.parse(localStorage.getItem('user') || '{}');
//   const cart      = JSON.parse(localStorage.getItem('cart') || '[]');
//   const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
//   const isActive  = (p) => location.pathname === p;

//   const handleLogout = () => { localStorage.clear(); navigate('/login'); };

//   return (
//     <nav style={s.nav}>
//       <Link to="/products" style={s.brand}>
//         🛍 <span style={s.brandName}>ShopEasy</span>
//       </Link>

//       <div style={s.links}>
//         {[
//           { path: '/products', label: 'Products' },
//           ...(token ? [
//             { path: '/cart',   label: `Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
//             { path: '/orders', label: 'Orders' },
//           ] : []),
//         ].map(({ path, label }) => (
//           <Link key={path} to={path} style={{ ...s.link, ...(isActive(path) ? s.linkActive : {}) }}>
//             {label}
//           </Link>
//         ))}
//       </div>

//       <div style={s.right}>
//         {token ? (
//           <>
//             <span style={s.greeting}>Hi, {user.username}</span>
//             <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login"    style={s.loginBtn}>Login</Link>
//             <Link to="/register" style={s.registerBtn}>Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// const s = {
//   nav: {
//     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//     padding: '0 40px', height: '62px', background: '#FFFFFF',
//     borderBottom: '1px solid #E4E7EC', position: 'sticky', top: 0, zIndex: 100,
//     boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
//   },
//   brand:       { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '18px' },
//   brandName:   { fontWeight: '700', color: '#111827', fontSize: '17px' },
//   links:       { display: 'flex', gap: '4px' },
//   link: {
//     padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
//     color: '#6B7280', fontSize: '14px', fontWeight: '500', transition: 'all 0.15s',
//   },
//   linkActive:  { color: '#4F46E5', background: '#EEF2FF', fontWeight: '600' },
//   right:       { display: 'flex', alignItems: 'center', gap: '10px' },
//   greeting:    { fontSize: '14px', color: '#6B7280' },
//   logoutBtn: {
//     padding: '7px 14px', border: '1px solid #E4E7EC', background: 'white',
//     color: '#6B7280', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
//     borderRadius: '8px', fontFamily: 'Outfit, sans-serif',
//   },
//   loginBtn: {
//     padding: '7px 14px', border: '1px solid #E4E7EC', borderRadius: '8px',
//     textDecoration: 'none', color: '#374151', fontSize: '13px', fontWeight: '500',
//   },
//   registerBtn: {
//     padding: '7px 14px', background: '#4F46E5', borderRadius: '8px',
//     textDecoration: 'none', color: 'white', fontSize: '13px', fontWeight: '600',
//   },
// };