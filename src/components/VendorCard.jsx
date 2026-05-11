import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const VendorCard = ({ vendor }) => (
  <Link to={`/vendor/${vendor._id}`} className="card vendor-card">
    <div className="vendor-avatar">
      {vendor.businessName?.charAt(0).toUpperCase()}
    </div>
    <h3 className="mt-2">{vendor.businessName}</h3>
    <div className="star-rating">
      <FaStar className="star filled" />
      <span>{vendor.rating?.toFixed(1) || '0.0'}</span>
      <span className="text-gray-500 ml-2">({vendor.numReviews || 0} reviews)</span>
    </div>
    <p className="mt-2 text-gray-500">{vendor.businessDescription?.substring(0, 100)}...</p>
  </Link>
);

export default VendorCard;