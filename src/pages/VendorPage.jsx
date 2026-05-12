import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVendor, getVendorProducts, getVendors } from '../store/slices/vendorSlice';
import { addToCart } from '../store/slices/cartSlice';
import StarRating from '../components/UI/StarRating';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  FaStore,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaShoppingCart,
  FaSearch,
  FaStar,
} from 'react-icons/fa';

const VendorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { vendor, vendorProducts, isLoading } = useSelector((state) => state.vendors);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    dispatch(getVendor(id));
    dispatch(getVendorProducts({ vendorId: id }));
    fetchReviews();
  }, [dispatch, id]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/vendors/${id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/vendors/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      fetchReviews();
      dispatch(getVendor(id));
      dispatch(getVendors());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  if (isLoading || !vendor) return <LoadingSpinner />;

  const filteredProducts = vendorProducts?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-vendor">

      <div className="vendor-hero">
        <div className="vendor-hero-avatar">
          {getInitials(vendor.businessName)}
        </div>
        <h1 className="vendor-hero-name">{vendor.businessName}</h1>
        <div className="vendor-hero-rating">
          <StarRating rating={vendor.rating} numReviews={vendor.numReviews} />
        </div>
        <p className="vendor-hero-desc">{vendor.businessDescription}</p>
        <div className="vendor-hero-contact">
          {vendor.businessAddress?.city && (
            <span><FaMapMarkerAlt /> {vendor.businessAddress.city}, {vendor.businessAddress.state}</span>
          )}
          {vendor.businessEmail && (
            <span><FaEnvelope /> {vendor.businessEmail}</span>
          )}
          {vendor.businessPhone && (
            <span><FaPhone /> {vendor.businessPhone}</span>
          )}
        </div>
      </div>

  
      <div className="vendor-products">
        <div className="vendor-products-toolbar">
          <h2>Products</h2>
          <div className="vendor-search">
            <FaSearch className="vendor-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="vendor-search-input"
            />
          </div>
        </div>

        {filteredProducts?.length === 0 ? (
          <div className="vendor-empty">
            <FaStore size={36} color="#d1d5db" />
            <p>No products available yet.</p>
          </div>
        ) : (
          <div className="vendor-products-grid">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="product-card-new"
              >
                <div className="product-card-img-wrapper">
                  <img
                    src={product.images?.[0]?.url || '/images/placeholder.png'}
                    alt={product.name}
                    className="product-card-img"
                  />
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="product-card-badge">
                      -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </span>
                  )}
                </div>
                <div className="product-card-info">
                  <h3 className="product-card-name">{product.name}</h3>
                  <div className="product-card-rating">
                    <StarRating rating={product.rating} numReviews={product.numReviews} />
                  </div>
                  <div className="product-card-price">
                    {product.discountPrice ? (
                      <>
                        <span className="product-card-original">₦{product.price.toFixed(2)}</span>
                        <span className="product-card-discount">₦{product.discountPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="product-card-current">₦{product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    className="product-card-btn"
                    disabled={product.stock === 0}
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <FaShoppingCart size={14} />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>


      <div className="vendor-reviews">
        <div className="vendor-reviews-toolbar">
          <h2>Customer Reviews</h2>
          {isAuthenticated && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="vendor-review-form">
            <div className="form-group">
              <label>Rating</label>
              <select
                className="form-select"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                className="form-textarea"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="vendor-empty">
            <FaStar size={36} color="#d1d5db" />
            <p>No reviews yet. Be the first to review this vendor!</p>
          </div>
        ) : (
          <div className="vendor-reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="vendor-review-item">
                <div className="vendor-review-header">
                  <strong>{review.user?.firstName} {review.user?.lastName}</strong>
                  <StarRating rating={review.rating} />
                </div>
                <h4>{review.title}</h4>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorPage;