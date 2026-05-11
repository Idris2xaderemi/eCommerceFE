import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { deleteProduct } from '../store/slices/productSlice';
import Pagination from '../components/UI/Pagination';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StarRating from '../components/UI/StarRating';
import { toast } from 'react-toastify';
import { FaSearch, FaShoppingCart, FaTrash, FaBoxOpen } from 'react-icons/fa';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, totalPages, currentPage, total, isLoading } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    dispatch(getProducts({ ...filters, sort: 'newest' }));
  }, [dispatch, filters]);

  const updateFilters = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: key === 'page' ? value : 1 };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleDelete = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this product permanently?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero" style={{backgroundColor:'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)'}}>
        <div className="products-hero-icon">
          <FaBoxOpen />
        </div>
        <h1 className="products-hero-title">Discover Products</h1>
        <p className="products-hero-subtitle">
          {total > 0 ? `${total} product${total !== 1 ? 's' : ''} available` : 'Find what you need from our verified vendors'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="products-toolbar">
        <div className="products-search">
          <FaSearch className="products-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="products-search-input"
          />
        </div>
        <select
          value={filters.category}
          onChange={(e) => updateFilters('category', e.target.value)}
          className="products-category-select"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Sports">Sports</option>
          <option value="Others">Others</option>

        </select>
      </div>

      {/* Product Grid */}
      <div className="products-container">
        {isLoading ? (
          <LoadingSpinner />
          ) : !products?.length ? (
          <div className="products-empty">
            <FaBoxOpen size={48} color="#d1d5db" />
            <h3>No products found</h3>
            <p>Try a different search or browse our categories.</p>
            {filters.search || filters.category ? (
              <button
                onClick={() => setFilters({ search: '', category: '', page: 1 })}
                className="products-clear-btn"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products?.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="product-item"
                >
                  {/* Admin delete button */}
                  {isAdmin && (
                    <button
                      className="product-delete-btn"
                      onClick={(e) => handleDelete(product._id, e)}
                      title="Delete product"
                    >
                      <FaTrash size={13} />
                    </button>
                  )}

                  <div className="product-img-wrapper">
                    <img
                      src={product.images?.[0]?.url || '/images/placeholder.png'}
                      alt={product.name}
                      className="product-img"
                    />
                    {product.discountPrice && product.discountPrice < product.price && (
                      <span className="product-discount-badge">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <StarRating rating={product.rating} numReviews={product.numReviews} />
                    </div>
                    <div className="product-price">
                      {product.discountPrice ? (
                        <>
                          <span className="product-original-price">₦{product.price.toFixed(2)}</span>
                          <span className="product-discount-price">₦{product.discountPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="product-current-price">₦{product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      className="product-cart-btn"
                      disabled={product.stock === 0}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <FaShoppingCart size={16} />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updateFilters('page', page)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;