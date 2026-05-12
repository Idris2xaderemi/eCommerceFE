import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import { getVendors } from '../store/slices/vendorSlice';
import { guestLogin } from '../store/slices/authSlice';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';
import Style from '../images/supermarket.png';
import {
  FaShoppingBag,
  FaStore,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaBoxOpen,
  FaLock,
  FaShippingFast,
  FaStar,
  FaArrowRight,
} from 'react-icons/fa';

const LandingPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { vendors } = useSelector((state) => state.vendors);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProducts({ limit: 8, sort: 'newest' }));
    dispatch(getVendors());
  }, [dispatch]);

  const handleGuest = () => dispatch(guestLogin());
  const showVendorCTA = !user || (user.role !== 'vendor' && user.role !== 'admin');

  return (
    <div 
    style={{backgroundColor:'#dce1e1'}}
    >
      {/* ========== HERO ========== */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
          color: 'white',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-25%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', left: '40%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div className="container" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3rem', paddingTop: '4rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '50px', marginBottom: '1.5rem' }}>
              <FaStar style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Trusted by at least 5 people</span>
            </div>
            <h1 style={{ fontSize: '3.8rem', lineHeight: 1.1, fontWeight: 800, marginBottom: '1.5rem' }}>
              <span>Discover Quality</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>From Verified Vendors</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
              Shop with confidence. Every vendor is verified, and your payment is protected until delivery.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 25px rgba(59,130,246,0.4)', transition: 'transform 0.2s' }}>
                <FaShoppingBag /> Start Shopping
              </Link>
              {showVendorCTA && (
                <Link to="/register" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}>
                  <FaStore /> Become a Vendor
                </Link>
              )}
              {!isAuthenticated && (
                <button onClick={handleGuest} style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', color: '#e2e8f0', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}>
                  Try as Guest
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>14k+</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Product Varieties</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #f472b6, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50k+</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Happy Customers</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #34d399, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10+</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Store Locations</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img src={Style} alt="Shopping" style={{ maxWidth: '500px', width: '100%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }} />
          </div>
        </div>
      </section>

      {/* ========== Three Highlight Cards ========== */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '0', marginTop: '-3rem', position: 'relative', zIndex: 2, flexWrap: 'wrap', padding: '0 1rem' }}>
        {[
          { icon: FaShippingFast, title: 'Free Shipping', desc: 'Free delivery on orders over ₦100', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
          { icon: FaLock, title: 'Secure Payment', desc: 'Money held safely until delivery', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
          { icon: FaBoxOpen, title: 'Quality Guarantee', desc: 'Every product verified for quality', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
        ].map((card, i) => (
          <div key={i} style={{ flex: '1 1 220px', padding: '2rem 1.5rem', color: 'white', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: card.gradient, borderRadius: i === 0 ? '16px 0 0 0' : i === 2 ? '0 16px 0 0' : '0' }}>
            <card.icon style={{ fontSize: '2.5rem', flexShrink: 0 }} />
            <div>
              <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{card.title}</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{card.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
        <div className="products-header">
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>Featured Products</h2>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Handpicked just for you</p>
          </div>
          <Link to="/products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View All <FaArrowRight />
          </Link>
        </div>
        {products?.length > 0 ? (
          <div className="grid grid-4" style={{ marginTop: '2rem' }}>
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500" style={{ padding: '3rem' }}>No products yet. Be the first vendor!</p>
        )}
      </section>


      <section style={{ background: '#dce1e1', padding: '5rem 0' }}>
        <div className="container">
          <div className="products-header">
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>Our Trusted Vendors</h2>
              <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Verified sellers you can rely on</p>
            </div>
            <Link to="/vendors" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View All <FaArrowRight />
            </Link>
          </div>
          {vendors?.length > 0 ? (
            <div className="grid grid-4" style={{ marginTop: '2rem' }}>
              {vendors.slice(0, 8).map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500" style={{ padding: '3rem' }}>No vendors yet.</p>
          )}
        </div>
      </section>


      {showVendorCTA && (
        <section style={{
          padding: '6rem 2rem',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(https://media.istockphoto.com/id/2155498776/photo/woman-walking-with-shopping-bags-on-city-street.jpg?s=1024x1024&w=is&k=20&c=rVcFfmH7V8PywEtGmZ2bMA4X7t0xWNiSvbECSZAyO_g=)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Become a Vendor</h2>
            <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: '2rem' }}>Join our marketplace and reach thousands of customers looking for quality products like yours.</p>
            <Link to="/register" style={{ background: 'white', color: '#1e293b', padding: '1rem 2.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'inline-block', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
              Start Selling Today
            </Link>
          </div>
        </section>
      )}


      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Why Shop With Us?</h2>
          <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>We make your shopping experience seamless and secure</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: FaTruck, title: 'Free Delivery', desc: 'Free shipping on orders above ₦100. Fast and reliable.' },
              { icon: FaShieldAlt, title: '100% Secure Payment', desc: 'Your payment is protected until you confirm delivery.' },
              { icon: FaHeadset, title: '24/7 Support', desc: 'We resolve disputes quickly and fairly.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '2.5rem 2rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
                  <item.icon />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;