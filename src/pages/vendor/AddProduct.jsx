import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../store/slices/productSlice';
import { getProfile } from '../../store/slices/authSlice';
import { getVendorAllProducts } from '../../store/slices/vendorSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));
    images.forEach((img) => fd.append('images', img));

    try {
      await dispatch(createProduct(fd)).unwrap();
      toast.success('Product created!');
      dispatch(getProfile());
      if (user?.vendorProfile?._id) {
        dispatch(getVendorAllProducts({ vendorId: user.vendorProfile._id }));
      }
      navigate('/vendor/dashboard/products?filter=all');
    } catch (err) {
      toast.error(err || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.9rem',
    background: 'white',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.35rem',
    fontWeight: 500,
    fontSize: '0.85rem',
    color: '#334155',
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Add New Product</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Fill in the details below to add a new product</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        {/* Product Name */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Product Name *</label>
          <input name="name" style={inputStyle} value={form.name} onChange={handleChange} required placeholder="Enter product name" />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            name="description"
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Describe your product"
          />
        </div>

        {/* Price + Discount */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Price (₦)*</label>
            <input type="number" step="0.01" name="price" style={inputStyle} value={form.price} onChange={handleChange} required placeholder="0.00" />
          </div>
          <div>
            <label style={labelStyle}>Discount Price (optional)</label>
            <input type="number" step="0.01" name="discountPrice" style={inputStyle} value={form.discountPrice} onChange={handleChange} placeholder="0.00" />
          </div>
        </div>

        {/* Category + Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" style={inputStyle} value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food</option>
              <option>Books</option>
              <option>Home</option>
              <option>Sports</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Stock *</label>
            <input type="number" name="stock" style={inputStyle} value={form.stock} onChange={handleChange} required placeholder="0" />
          </div>
        </div>

        {/* Images */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Images</label>
          <div style={{
            border: '2px dashed #e2e8f0',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#f8fafc',
          }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
              <FaUpload style={{ fontSize: '1.5rem', color: '#94a3b8', marginBottom: '0.5rem' }} />
              <p style={{ color: '#64748b', fontWeight: 500 }}>Click to upload images</p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {images.length > 0 ? `${images.length} file(s) selected` : 'JPG, PNG or GIF (max 5MB)'}
              </p>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <FaSave />
          {submitting ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;