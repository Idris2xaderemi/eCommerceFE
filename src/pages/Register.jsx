import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
    businessName: '',
    businessDescription: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      showNotification('register', `Welcome, ${user?.firstName || 'User'}!`);
      navigate('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch, showNotification, user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
    };
    if (formData.role === 'vendor') {
      userData.businessName = formData.businessName;
      userData.businessDescription = formData.businessDescription;
      userData.businessAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };
      userData.businessPhone = formData.phone;
      userData.businessEmail = formData.email;
    }
    dispatch(register(userData));
  };


  if (isAuthenticated) {
    return (
      <div className="login-background flex justify-center items-center p-4">
        <div className="card p-4 text-center" style={{ maxWidth: '400px' }}>
          <h3>Already logged in</h3>
          <p>You are logged in as <strong>{user?.firstName} {user?.lastName}</strong>.</p>
          <p>To create a new account, please log out first.</p>
          <button onClick={handleLogout} className="btn btn-primary mt-2">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-background flex justify-center items-center p-4">
      <div className="login-card">
        {/* Left image */}
        <div className="login-image-wrapper">
          <img
            className="login-image"
            src="https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG9ubGluZSUyMHNob3BwaW5nfGVufDB8fDB8fHww"
            alt="Shopping illustration"
          />
        </div>


        <div className="login-form-wrapper">
          <div className="login-brand">KaraKata</div>
          <h3 className="login-title">Create your account</h3>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                className="form-input"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                className="form-input"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
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
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <div className="form-row">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Customer</option>
              <option value="vendor">Vendor</option>
            </select>

            {formData.role === 'vendor' && (
              <>
                <input
                  type="text"
                  name="businessName"
                  className="form-input"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="businessDescription"
                  className="form-textarea"
                  placeholder="Business Description"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  required
                />
                <div className="form-row">
                  <input
                    type="text"
                    name="street"
                    className="form-input"
                    placeholder="Street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    name="state"
                    className="form-input"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    className="form-input"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  type="text"
                  name="country"
                  className="form-input"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="login-links">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
            <p>Terms of use. Privacy policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;