import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { createReview, getProductReviews } from '../store/slices/reviewSlice';
import StarRating from '../components/UI/StarRating';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaStore, FaStar } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, isLoading } = useSelector((state) => state.products);
  const { reviews } = useSelector((state) => state.reviews);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });

  useEffect(() => {
    dispatch(getProduct(id));
    dispatch(getProductReviews(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);


  const refreshReviews = () => dispatch(getProductReviews(id));

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }
    try {
      await dispatch(createReview({ productId: id, reviewData: reviewForm })).unwrap();
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      refreshReviews();
    } catch (err) {
      toast.error(err || 'Review failed');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div className="container mt-3 alert alert-error">Product not found</div>;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="container mt-3">
      <div className="grid grid-2" style={{ gap: '2rem' }}>
        <div>
          <img
            src={product.images?.[0]?.url || '/images/placeholder.png'}
            alt={product.name}
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} numReviews={product.numReviews} />
          {product.vendor && (
            <p className="mt-2">
              <FaStore /> Sold by: {product.vendor.businessName}
              <button onClick={() => navigate(`/vendor/${product.vendor._id}`)} className="btn btn-sm btn-outline ml-2">View Store</button>
            </p>
          )}
          <div className="product-price mt-2">
            {hasDiscount ? (
              <>
                <span className="original-price">₦{product.price.toFixed(2)}</span>
                <span className="discount-price">₦{product.discountPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="price">₦{product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="mt-2">{product.description}</p>
          <p className="mt-2">Stock: {product.stock > 0 ? product.stock : 'Out of stock'}</p>
          <button
            className="btn btn-primary btn-lg mt-2"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>


      <div className="mt-4">
        <h3>Customer Reviews</h3>
        {reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="grid gap-2 mt-2">
            {reviews?.map((review) => (
              <div key={review._id} className="card p-3">
                <div className="flex justify-between">
                  <strong>{review.user?.firstName} {review.user?.lastName}</strong>
                  <StarRating rating={review.rating} />
                </div>
                <h5 className="mt-1">{review.title}</h5>
                <p className="text-gray-500">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="card p-4 mt-3">
            <h4>Write a Review</h4>
            <div className="form-group">
              <label>Rating</label>
              <select className="form-select" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-input" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea className="form-textarea" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;