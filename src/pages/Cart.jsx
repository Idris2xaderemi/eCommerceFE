import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import EmptyState from '../components/UI/EmptyState';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FaShoppingCart}
        title="Your cart is empty"
        message="Add some products to get started!"
        linkTo="/products"
        linkText="Continue Shopping"
      />
    );
  }

  return (
    <div className="container mt-3">
      <div className="flex justify-between items-center mb-3">
        <h2>Shopping Cart ({totalQuantity} items)</h2>
        <button onClick={() => dispatch(clearCart())} className="btn btn-outline btn-sm"><FaTrash /> Clear Cart</button>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
        <div>
          {items.map((item) => (
            <div key={item.product} className="cart-item">
              <img src={item.image || '/images/placeholder.png'} alt={item.name} className="cart-item-img" />
              <div>
                <h4>{item.name}</h4>
                {item.vendorName && <p className="text-gray-500">Sold by: {item.vendorName}</p>}
                <p className="price">₦{item.price.toFixed(2)}</p>
              </div>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                  onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }))}
                >
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button
                  className="quantity-btn"
                  disabled={item.quantity >= item.stock}
                  onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                >
                  <FaPlus />
                </button>
              </div>
              <div>
                <p className="fw-bold">₦{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => dispatch(removeFromCart(item.product))} className="btn btn-sm btn-outline">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="flex justify-between mt-2">
            <span>Subtotal</span>
            <span>₦{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Shipping</span>
            <span>{totalAmount > 100 ? 'Free' : '$10.00'}</span>
          </div>
          <hr />
          <div className="flex justify-between fw-bold">
            <span>Total</span>
            <span>₦{totalAmount > 100 ? totalAmount.toFixed(2) : (totalAmount + 10).toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block mt-3">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;