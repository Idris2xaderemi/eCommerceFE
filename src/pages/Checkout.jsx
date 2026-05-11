import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaTruck, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.08;
  const orderTotal = totalAmount + shippingCost + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success('Payment successful!');
      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  const placeOrder = async () => {
  // ----- 1. Validate order data structure -----
  // Check cart not empty
  if (!items || items.length === 0) {
    toast.error('Your cart is empty');
    return;
  }
  // Check each item has required fields
  for (const [idx, item] of items.entries()) {
    if (!item.product || !item.name || item.quantity == null || item.price == null) {
      toast.error(`Cart item ${idx + 1} is incomplete. Please remove and re-add it.`);
      return;
    }
  }
  // Check shipping address
  const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
  const missing = requiredAddressFields.filter(field => !shipping[field]?.trim());
  if (missing.length > 0) {
    toast.error(`Missing shipping fields: ${missing.join(', ')}`);
    return;
  }

  // 2. Build order data


const orderData = {
  orderItems: items.map((item) => ({
    product: item.product,
    name: item.name,
    quantity: Number(item.quantity),
    price: Number(item.price),
    vendor: item.vendor || null,
    vendorName: item.vendorName || '',   // <-- add this
    image: item.image || '',
  })),
    shippingAddress: {
      street: shipping.street.trim(),
      city: shipping.city.trim(),
      state: shipping.state.trim(),
      zipCode: shipping.zipCode.trim(),
      country: shipping.country.trim(),
    },
    itemsPrice: parseFloat(totalAmount.toFixed(2)),
    taxPrice: parseFloat(tax.toFixed(2)),
    shippingPrice: parseFloat(shippingCost.toFixed(2)),
    totalPrice: parseFloat(orderTotal.toFixed(2)),
    paymentInfo: {
      method: 'card',
      status: 'completed',
    },
  };

  // 3. Send the order
  try {
    const res = await dispatch(createOrder(orderData)).unwrap();
    dispatch(clearCart());
    toast.success('Order placed!');
    navigate(`/orders/${res.order._id}`);
  } catch (err) {
    // Display the specific error from backend
    const msg = typeof err === 'string' ? err : err?.message || 'Order failed';
    toast.error(msg);
  }
};

  return (
    <div className="container mt-3" style={{ maxWidth: '900px' }}>
      <h2>Checkout</h2>
      <div className="checkout-steps mb-3">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span>Shipping</span>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Payment</span>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirm</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div>
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="card p-4">
              <h3><FaTruck /> Shipping Address</h3>
              <div className="form-group">
                <label>Street</label>
                <input className="form-input" value={shipping.street} onChange={(e) => setShipping({...shipping, street: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input className="form-input" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="form-input" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input className="form-input" value={shipping.zipCode} onChange={(e) => setShipping({...shipping, zipCode: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input className="form-input" value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Continue to Payment</button>
            </form>
          )}

          {step === 2 && (
            <div className="card p-4">
              <h3><FaCreditCard /> Payment Details</h3>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input className="form-input" value={payment.name} onChange={(e) => setPayment({...payment, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input className="form-input" value={payment.cardNumber} onChange={(e) => setPayment({...payment, cardNumber: e.target.value})} placeholder="1234 5678 9012 3456" maxLength="19" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry (MM/YY)</label>
                  <input className="form-input" value={payment.expiry} onChange={(e) => setPayment({...payment, expiry: e.target.value})} placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input className="form-input" type="password" value={payment.cvv} onChange={(e) => setPayment({...payment, cvv: e.target.value})} maxLength="4" required />
                </div>
              </div>
              <div className="flex justify-between">
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={simulatePayment} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-4 text-center">
              <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--success)' }} />
              <h3>Payment Successful</h3>
              <p>Review your order and confirm.</p>
              <div className="flex justify-center gap-2 mt-3">
                <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-success" onClick={placeOrder}>Confirm Order</button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="cart-summary" style={{ position: 'sticky', top: '80px' }}>
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.product} className="flex justify-between mb-1">
              <span>{item.name} x{item.quantity}</span>
              <span>₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between"><span>Subtotal</span><span>₦{totalAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₦${shippingCost.toFixed(2)}`}</span></div>
          <div className="flex justify-between"><span>Tax (8%)</span><span>₦{tax.toFixed(2)}</span></div>
          <hr />
          <div className="flex justify-between fw-bold"><span>Total</span><span>₦{orderTotal.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;