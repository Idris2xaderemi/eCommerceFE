import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, confirmDelivery } from '../store/slices/orderSlice';
import OrderStatusTracker from '../components/OrderStatusTracker';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const OrderTracking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [disputeReason, setDisputeReason] = useState('');

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  const handleConfirmDelivery = async () => {
    try {
      await dispatch(confirmDelivery(order._id)).unwrap();
      toast.success('Delivery confirmed!');
    } catch (err) {
      toast.error(err || 'Failed to confirm');
    }
  };

const handleDispute = async () => {
  if (!order?._id) {
    toast.error('Order is still loading. Please try again.');
    return;
  }
  if (!disputeReason.trim()) {
    toast.error('Please provide a reason');
    return;
  }

  try {
    await api.post('/orders/dispute', {
      orderId: order._id,
      reason: disputeReason.trim(),
      description: 'Customer dispute',      // ← add this
    });
    toast.success('Dispute filed');
    setDisputeReason('');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to file dispute');
  }
};

  if (isLoading || !order) return <LoadingSpinner />;

  const canConfirmDelivery =
    user?.role === 'user' && order.orderStatus === 'shipped';

  return (
    <div className="container mt-3" style={{ maxWidth: '800px' }}>
      <h2>Order #{order._id?.slice(-8)}</h2>
      <OrderStatusTracker currentStatus={order.orderStatus} />

      <div className="card p-4 mt-3">
        <h3>Order Details</h3>
        <div className="grid grid-2 mt-2">
          <div>
            <h4>Shipping Address</h4>
            <p>
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.zipCode}<br />
              {order.shippingAddress?.country}
            </p>
          </div>
          <div>
            <h4>Payment</h4>
            <p>Method: {order.paymentInfo?.method}</p>
            <p>Status: {order.paymentInfo?.status}</p>
            <p>Total: ₦{order.totalPrice?.toFixed(2)}</p>
          </div>
        </div>
        <h4 className="mt-3">Items</h4>
        {order.orderItems?.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-2 border-bottom"
          >
            <div className="flex items-center gap-2">
              <img
                src={item.image || '/images/placeholder.png'}
                alt={item.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                className="rounded"
              />
              <span>
                {item.name} x {item.quantity}
              </span>
            </div>
            <span>₦{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {canConfirmDelivery && (
        <button
          onClick={handleConfirmDelivery}
          className="btn btn-success mt-3 btn-block"
        >
          Confirm Delivery & Release Payment
        </button>
      )}

      {order.orderStatus !== 'cancelled' &&
        order.orderStatus !== 'delivered' && (
          <div className="card p-4 mt-3">
            <h4>
              <FaExclamationTriangle /> Report an Issue
            </h4>
            <textarea
              className="form-textarea mt-2"
              rows="3"
              placeholder="Describe the problem..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
<button
  onClick={handleDispute}
  disabled={!order?._id || !disputeReason.trim()}
  className="btn btn-danger mt-2"
>
  File Dispute
</button>
          </div>
        )}
    </div>
  );
};

export default OrderTracking;