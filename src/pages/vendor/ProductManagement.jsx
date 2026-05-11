import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import vendorService from '../../services/vendorServices';
import { toast } from 'react-toastify';
import {
  FaTrash,
  FaEdit,
  FaSearch,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaExclamationCircle,
} from 'react-icons/fa';

const ProductManagement = () => {
  const [searchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter') || 'all';
  const { user } = useSelector((state) => state.auth);
  const vendor = user?.vendorProfile;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(urlFilter);

  useEffect(() => {
    setActiveFilter(urlFilter);
  }, [urlFilter]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!vendor?._id) return;
        const data = await vendorService.getVendorAllProducts(vendor._id);
        setProducts(data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [vendor]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const { default: productService } = await import('../../services/productService');
      await productService.deleteProduct(productId);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  let filteredProducts = [...products];
  if (activeFilter === 'pending') filteredProducts = filteredProducts.filter((p) => !p.isApproved);
  else if (activeFilter === 'approved') filteredProducts = filteredProducts.filter((p) => p.isApproved);
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter((p) => p.name.toLowerCase().includes(term));
  }

  const counts = {
    all: products.length,
    pending: products.filter((p) => !p.isApproved).length,
    approved: products.filter((p) => p.isApproved).length,
  };

  if (!vendor) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        Vendor profile not loaded.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: 'white' }}>Products</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {counts.all} total · {counts.pending} pending · {counts.approved} approved
          </p>
        </div>
        <Link to="/vendor/dashboard/add-product" style={{
          background: 'white',
          color: '#1e293b',
          padding: '0.6rem 1.25rem',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'transform 0.2s',
        }}>
          <FaPlus /> Add Product
        </Link>
      </div>

      {/* Filter + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'white', borderRadius: '10px', padding: '0.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {[
            { key: 'all', label: 'All', count: counts.all, icon: FaBox },
            { key: 'pending', label: 'Pending', count: counts.pending, icon: FaClock },
            { key: 'approved', label: 'Approved', count: counts.approved, icon: FaCheckCircle },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeFilter === tab.key ? '#1e293b' : 'transparent',
                color: activeFilter === tab.key ? 'white' : '#64748b',
                fontWeight: 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <tab.icon style={{ fontSize: '0.8rem' }} />
              {tab.label}
              <span style={{
                background: activeFilter === tab.key ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                padding: '0.1rem 0.5rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '220px' }}>
          <FaSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '0.9rem',
              background: 'white',
            }}
          />
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div className="spinner" />
          <p style={{ marginTop: '1rem' }}>Loading products...</p>
        </div>
      ) : error && products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <FaExclamationCircle style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '0.75rem' }} />
          <p style={{ color: '#ef4444', marginBottom: '0.75rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}>Retry</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <FaBox style={{ fontSize: '2.5rem', color: '#d1d5db', marginBottom: '0.75rem' }} />
          <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
            No {activeFilter !== 'all' ? activeFilter : ''} products found
          </h4>
          {searchTerm ? (
            <p style={{ color: '#64748b' }}>No results for "{searchTerm}"</p>
          ) : (
            <p style={{ color: '#64748b' }}>Create your first product to get started.</p>
          )}
          <Link to="/vendor/dashboard/add-product" style={{
            display: 'inline-block',
            marginTop: '1rem',
            background: '#1e293b',
            color: 'white',
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Add Product
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={{
              background: 'white',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                minWidth: '100px',
                borderRadius: '10px',
                background: `url(${product.images?.[0]?.url || '/images/placeholder.png'}) center/cover`,
                backgroundColor: '#f8fafc',
              }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>{product.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6' }}>₦{product.price?.toFixed(2)}</span>
                    {product.discountPrice && (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₦{product.discountPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Stock: {product.stock}</p>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: product.isApproved ? '#d1fae5' : '#fef3c7',
                    color: product.isApproved ? '#065f46' : '#92400e',
                  }}>
                    {product.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    onClick={() => toast.info('Edit feature coming soon')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#fef2f2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;