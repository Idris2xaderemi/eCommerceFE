import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../store/slices/orderSlice';
import { getVendorAllProducts } from '../../store/slices/vendorSlice';
import { getProfile } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEdit,
  FaTimes,
  FaSave,
} from 'react-icons/fa';

const VendorOverview = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const { allVendorProducts, isLoadingAllProducts } = useSelector((state) => state.vendors);
  const vendor = user?.vendorProfile;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessEmail: '',
    businessPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    dispatch(getOrders());
    if (vendor?._id) {
      dispatch(getVendorAllProducts({ vendorId: vendor._id }));
    }
  }, [dispatch, vendor]);

  useEffect(() => {
    if (vendor) {
      setFormData({
        businessName: vendor.businessName || '',
        businessDescription: vendor.businessDescription || '',
        businessEmail: vendor.businessEmail || '',
        businessPhone: vendor.businessPhone || '',
        street: vendor.businessAddress?.street || '',
        city: vendor.businessAddress?.city || '',
        state: vendor.businessAddress?.state || '',
        zipCode: vendor.businessAddress?.zipCode || '',
        country: vendor.businessAddress?.country || '',
      });
    }
  }, [vendor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/vendors/profile', {
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        businessAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });
      dispatch(getProfile());
      toast.success('Business information updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (!vendor) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        Vendor profile not loaded. Please log out and back in.
      </div>
    );
  }

const vendorOrders = (orders || []).filter((order) =>
    order.orderItems?.some((item) => item.vendor === vendor._id)
  );
  const pendingAndConfirmed = vendorOrders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed'
  ).length;
  const completedOrders = vendorOrders.filter((o) => o.orderStatus === 'delivered').length;
  const totalRevenue = vendorOrders
    .filter((o) => o.orderStatus === 'delivered')
    .reduce((sum, order) => {
      const vendorItems = order.orderItems.filter((item) => item.vendor === vendor._id);
      return sum + vendorItems.reduce((s, item) => s + item.price * item.quantity, 0);
    }, 0);

const totalProducts = allVendorProducts?.length || vendor?.totalProducts || 0;
const pendingProducts = (allVendorProducts || []).filter((p) => !p.isApproved).length;
const approvedProducts = (allVendorProducts || []).filter((p) => p.isApproved).length;

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
          Welcome, {vendor.businessName}!
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{vendor.businessDescription}</p>
      </div>

      {/* ===== Product Stats ===== */}
      <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94a3b8', marginBottom: '0.75rem' }}>Products</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total products', value: totalProducts, icon: FaBox, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Pending approval', value: pendingProducts, icon: FaClock, color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Approved', value: approvedProducts, icon: FaCheckCircle, color: '#10b981', bg: '#d1fae5' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
              <stat.icon />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Orders & Revenue ===== */}
      <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94a3b8', marginBottom: '0.75rem' }}>Orders & revenue</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <FaShoppingCart />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Total orders</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>{vendorOrders.length}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{pendingAndConfirmed} pending · {completedOrders} delivered</p>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <FaDollarSign />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Revenue</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>₦{totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>From delivered orders</p>
          </div>
        </div>
      </div>

      {/* ===== Business Information (Editable) ===== */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Business Information</h3>
          {!editing ? (
            <button onClick={() => setEditing(true)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>
              <FaEdit /> Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSave} disabled={saving} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>
                <FaSave /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Business Name */}
          <div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaStore /> Business Name
            </p>
            {editing ? (
              <input name="businessName" value={formData.businessName} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
            ) : (
              <p style={{ fontWeight: 500, color: '#1e293b' }}>{vendor.businessName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaEnvelope /> Email
            </p>
            {editing ? (
              <input name="businessEmail" value={formData.businessEmail} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
            ) : (
              <p style={{ fontWeight: 500, color: '#1e293b' }}>{vendor.businessEmail || user?.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaPhone /> Phone
            </p>
            {editing ? (
              <input name="businessPhone" value={formData.businessPhone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
            ) : (
              <p style={{ fontWeight: 500, color: '#1e293b' }}>{vendor.businessPhone || user?.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <FaMapMarkerAlt /> Address
            </p>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <input name="street" value={formData.street} onChange={handleChange} placeholder="Street" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State" style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip" style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
                  <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }} />
                </div>
              </div>
            ) : (
              <p style={{ fontWeight: 500, color: '#1e293b', lineHeight: 1.4 }}>
                {vendor.businessAddress?.street}, {vendor.businessAddress?.city}<br />
                {vendor.businessAddress?.state}, {vendor.businessAddress?.zipCode}<br />
                {vendor.businessAddress?.country}
              </p>
            )}
          </div>

          {/* Business Description (full width when editing) */}
          <div style={{ gridColumn: editing ? '1 / -1' : 'auto' }}>
            {editing && (
              <>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                  <FaEdit /> Business Description
                </p>
                <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} rows="3" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;