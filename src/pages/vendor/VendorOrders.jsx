import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, updateVendorItemsStatus } from '../../store/slices/orderSlice';
import { toast } from 'react-toastify';

const VendorOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorProfile?._id;

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  // Filter orders containing items of this vendor
  const vendorOrders = orders.filter((order) =>
    order.orderItems?.some((item) => item.vendor === vendorId)
  );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateVendorItemsStatus({ orderId, status: newStatus })).unwrap();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      {vendorOrders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="mt-3">
          {vendorOrders.map((order) => {
            const myItems = order.orderItems.filter((item) => item.vendor === vendorId);
            return (
              <div key={order._id} className="card p-3 mb-3">
                <div className="flex justify-between">
                  <span><strong>Order #{order._id.slice(-8)}</strong></span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <p>Total: ₦{order.totalPrice?.toFixed(2)}</p>
                <p>Order Status: {order.orderStatus}</p>
                <h4>Your Items:</h4>
                {myItems.map((item) => (
                  <div key={item._id} className="border-bottom py-1">
                    {item.name} x {item.quantity} — status: {item.itemStatus}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  {myItems.some(i => i.itemStatus === 'pending') && (
                    <button onClick={() => handleStatusChange(order._id, 'confirmed')} className="btn btn-sm btn-success">Confirm</button>
                  )}
                  {myItems.some(i => i.itemStatus === 'confirmed') && (
                    <button onClick={() => handleStatusChange(order._id, 'processing')} className="btn btn-sm btn-primary">Start Processing</button>
                  )}
                  {myItems.some(i => i.itemStatus === 'processing') && (
                    <button onClick={() => handleStatusChange(order._id, 'shipped')} className="btn btn-sm btn-primary">Mark Shipped</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;