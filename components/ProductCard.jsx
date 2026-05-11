import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaStore } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  // compute if discount exists
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="card" style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={product.images?.[0]?.url || '/images/placeholder.png'}
          alt={product.name}
          className="card-img"
        />
        {hasDiscount && (
          <span className="discount-badge">-{discountPercent}%</span>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>

        <div className="flex items-center gap-1 mb-1">
          <FaStar className="star filled" />
          <span>{product.rating?.toFixed(1) || 'New'}</span>
          <span className="text-gray-500">({product.numReviews || 0})</span>
        </div>

        {product.vendor && (
          <div className="flex items-center gap-1 text-gray-500 mb-2">
            <FaStore /> {product.vendor.businessName}
          </div>
        )}

        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="original-price">${product.price.toFixed(2)}</span>
              <span className="discount-price">${product.discountPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price">${product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          className="btn btn-primary w-full mt-2"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          <FaShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;