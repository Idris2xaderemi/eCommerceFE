import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../store/slices/orderSlice';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mt-3">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/products">Start shopping</Link></p>
      ) : (
        <div className="mt-2">
          {orders.map((order) => (
            <div key={order._id} className="card p-3 mb-2 flex justify-between items-center">
              <div>
                <h4>Order #{order._id?.slice(-8)}</h4>
                <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Status: <strong>{order.orderStatus}</strong></p>
                <p>Total: ₦{order.totalPrice?.toFixed(2)}</p>
              </div>
              <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;