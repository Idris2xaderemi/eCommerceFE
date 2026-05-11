import { Link } from 'react-router-dom';
import StarRating from './UI/StarRating';

const VendorCard = ({ vendor }) => (
  <Link to={`/vendor/${vendor._id}`} className="card vendor-card">
    <div className="vendor-avatar">{vendor.businessName?.charAt(0).toUpperCase()}</div>
    <h3 className="mt-2">{vendor.businessName}</h3>
    <StarRating rating={vendor.rating} numReviews={vendor.numReviews} />
    <p className="mt-2 text-gray-500">{vendor.businessDescription?.substring(0, 80)}...</p>
  </Link>
);

export default VendorCard;