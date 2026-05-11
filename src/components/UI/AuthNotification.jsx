import { useEffect, useState } from 'react';
import { FaCheckCircle, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';

const AuthNotification = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 400);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    login: FaSignInAlt,
    logout: FaSignOutAlt,
    register: FaUserPlus,
    success: FaCheckCircle,
  };

  const colors = {
    login: { bg: '#eff6ff', border: '#3b82f6', icon: '#2563eb', text: '#1e40af' },
    logout: { bg: '#fef2f2', border: '#ef4444', icon: '#dc2626', text: '#991b1b' },
    register: { bg: '#f0fdf4', border: '#22c55e', icon: '#16a34a', text: '#166534' },
    success: { bg: '#f0fdf4', border: '#22c55e', icon: '#16a34a', text: '#166534' },
  };

  const color = colors[type] || colors.success;
  const Icon = icons[type] || FaCheckCircle;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    >
      <div
        style={{
          background: 'white',
          borderLeft: `4px solid ${color.border}`,
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          minWidth: '320px',
          maxWidth: '420px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: color.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ fontSize: '1.25rem', color: color.icon }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: color.text, margin: 0, fontSize: '0.95rem' }}>
            {message}
          </p>
          <p style={{ color: '#64748b', margin: '2px 0 0', fontSize: '0.8rem' }}>
            {type === 'login' && 'Welcome back!'}
            {type === 'logout' && 'See you soon!'}
            {type === 'register' && 'Let\'s get started!'}
            {type === 'success' && 'Success!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthNotification;