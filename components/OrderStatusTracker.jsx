import { FaBox, FaCheckCircle, FaTruck, FaHome } from 'react-icons/fa';

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: FaBox },
  { status: 'confirmed', label: 'Confirmed', icon: FaCheckCircle },
  { status: 'processing', label: 'Processing', icon: FaBox },
  { status: 'shipped', label: 'Shipped', icon: FaTruck },
  { status: 'delivered', label: 'Delivered', icon: FaHome },
];

const OrderStatusTracker = ({ currentStatus }) => {
  const currentIdx = statusSteps.findIndex(s => s.status === currentStatus);

  return (
    <div className="tracker">
      {statusSteps.map((step, idx) => (
        <div
          key={step.status}
          className={`tracker-step ${idx <= currentIdx ? 'completed' : ''}`}
        >
          <div className="tracker-icon">
            <step.icon />
          </div>
          <span className="tracker-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTracker;