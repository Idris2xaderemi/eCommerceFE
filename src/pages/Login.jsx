import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      showNotification('login', `Welcome back, ${user?.firstName || 'User'}!`);
      navigate('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch, showNotification, user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="login-background flex justify-center items-center p-4">
      <div className="login-card">
        <div className="login-image-wrapper">
          <img
            className="login-image"
            src="https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG9ubGluZSUyMHNob3BwaW5nfGVufDB8fDB8fHww"
            alt="Shopping illustration"
          />
        </div>
        <div className="login-form-wrapper">
          <div className="login-brand">KaraKata</div>
          <h3 className="login-title">Sign in to your account</h3>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-2">
            <Link to="/forgot-password" className="login-link">Forgot Password?</Link>
          </div>
          <div className="login-links">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            <p>Terms of use. Privacy policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;