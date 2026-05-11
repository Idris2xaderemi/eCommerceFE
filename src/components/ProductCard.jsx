import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { deleteProduct } from '../store/slices/productSlice';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaStore, FaTrash } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete ${product.name} permanently?`)) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete product');
      }
    }
  };

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="card" style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img
         src={product.images?.[0]?.url || 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'}
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
              <span className="original-price">₦{product.price.toFixed(2)}</span>
              <span className="discount-price">₦{product.discountPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price">₦{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            className="btn btn-primary w-full"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <FaShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {isAdmin && (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              title="Delete product"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;