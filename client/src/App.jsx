import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar    from './components/Navbar';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Products  from './pages/Products';
import Cart      from './pages/Cart';
import Orders    from './pages/Orders';
import Checkout  from './pages/Checkout';
import Profile   from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        <Routes>
          <Route path="/"         element={<Navigate to="/products" />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart"     element={<UserRoute><Cart /></UserRoute>} />
          <Route path="/orders"   element={<UserRoute><Orders /></UserRoute>} />
          <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
          <Route path="/profile"  element={<UserRoute><Profile /></UserRoute>} />
          <Route path="/admin"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
