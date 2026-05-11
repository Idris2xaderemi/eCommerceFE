import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset link sent to your email!');
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Right form */}
        <div className="login-form-wrapper">
          <div className="login-brand">KaraKata</div>
          <h3 className="login-title">Forgot Password</h3>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="login-form">
              <p className="text-gray-500 text-sm">
                Enter your email and we'll send you a link to reset your password.
              </p>
              <input
                type="email"
                className="form-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-success">Check your email for the reset link.</p>
            </div>
          )}

          <div className="login-links">
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;