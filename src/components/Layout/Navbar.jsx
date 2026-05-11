import { clearCart } from '../../store/slices/cartSlice';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { FaShoppingCart, FaUser, FaStore, FaBars, FaTimes } from 'react-icons/fa'
import { useNotification } from '../../context/NotificationContext';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalQuantity } = useSelector((state) => state.cart)
  const { showNotification } = useNotification();

  

const handleLogout = () => {
  dispatch(logout());
  dispatch(clearCart());
  showNotification('logout', 'You have been logged out');
  navigate('/');
  setIsOpen(false);

};
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <FaStore /> KaraKata
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/products" className="nav-link" onClick={() => setIsOpen(false)}>Products</Link>
          <Link to="/vendors" className="nav-link" onClick={() => setIsOpen(false)}>Vendors</Link>
          {user?.role === 'vendor' && (
            <Link to="/vendor/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Admin</Link>
          )}
          
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="nav-link"><FaUser /> {user?.firstName}</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar