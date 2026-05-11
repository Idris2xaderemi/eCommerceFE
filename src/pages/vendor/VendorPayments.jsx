import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../store/slices/orderSlice';
import { FaDollarSign } from 'react-icons/fa';

const VendorPayments = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const vendorId = user?.vendorProfile?._id;

  // Only delivered orders that contain items belonging to this vendor
const vendorDeliveredOrders = (orders || []).filter(
    (order) =>
      order.orderStatus === 'delivered' &&
      order.orderItems?.some((item) => item.vendor === vendorId)
  );

  // Total revenue from those delivered orders
  const totalEarned = vendorDeliveredOrders.reduce((sum, order) => {
    const vendorItems = order.orderItems.filter(
      (item) => item.vendor === vendorId
    );
    return (
      sum +
      vendorItems.reduce(
        (s, item) => s + item.price * item.quantity,
        0
      )
    );
  }, 0);

  return (
    <div>
      <h2>Payments</h2>

      {/* Total Earned Card */}
      <div className="stat-card mt-3">
        <FaDollarSign className="stat-icon" />
        <div>
          <h3>Total Earned</h3>
          <p className="text-2xl fw-bold">₦{totalEarned.toFixed(2)}</p>
        </div>
      </div>

      {/* Completed Orders List */}
      <div className="mt-4">
        <h4>Completed Orders</h4>
        {vendorDeliveredOrders.length === 0 ? (
          <div className="card p-4 text-center text-gray-500 mt-2">
            No completed orders yet.
          </div>
        ) : (
          vendorDeliveredOrders.map((order) => {
            const vendorItems = order.orderItems.filter(
              (item) => item.vendor === vendorId
            );
            const orderAmount = vendorItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div key={order._id} className="card p-3 mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Order #{order._id.slice(-8)}</strong>
                    <p className="text-gray-500 text-sm">
                      Delivered on:{' '}
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="fw-bold text-primary">
                    ₦{orderAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VendorPayments;