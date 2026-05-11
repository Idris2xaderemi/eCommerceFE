import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVendors } from '../store/slices/vendorSlice';
import { removeVendor } from '../store/slices/adminSlice';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StarRating from '../components/UI/StarRating';
import { toast } from 'react-toastify';
import { FaTrash, FaStore, FaMapMarkerAlt } from 'react-icons/fa';

const VendorsListPage = () => {
  const dispatch = useDispatch();
  const { vendors, isLoading } = useSelector((state) => state.vendors);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  const handleRemove = async (vendorId) => {
    if (window.confirm('Remove this vendor permanently? They will be notified via email.')) {
      try {
        await dispatch(removeVendor(vendorId)).unwrap();
        toast.success('Vendor removed');
        dispatch(getVendors());
      } catch (err) {
        toast.error(err || 'Failed to remove vendor');
      }
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const avatarColors = [
    { bg: '#E1F5EE', color: '#0F6E56' },
    { bg: '#FAEEDA', color: '#854F0B' },
    { bg: '#EEEDFE', color: '#534AB7' },
    { bg: '#FAECE7', color: '#993C1D' },
    { bg: '#E6F1FB', color: '#185FA5' },
  ];

  return (
    <div className="vendors-page">
      {/* Hero Section */}
      <div className="vendors-hero">
        <div className="vendors-hero-icon">
          <FaStore />
        </div>
        <h1 className="vendors-hero-title">Our trusted vendors</h1>
        <p className="vendors-hero-subtitle">
          Browse verified sellers who offer quality products and reliable service.
        </p>
      </div>

      {/* Main Content */}
      <div className="vendors-container">
        {isLoading ? (
          <LoadingSpinner />
        ) : vendors.length === 0 ? (
          <div className="vendors-empty">
            <FaStore size={48} color="#d1d5db" />
            <h3>No vendors yet</h3>
            <p>Check back later or register as a vendor yourself!</p>
          </div>
        ) : (
          <div className="vendors-grid">
            {vendors.map((vendor, i) => {
              const { bg, color } = avatarColors[i % avatarColors.length];
              return (
                <div key={vendor._id} className="vendor-item">
                  {isAdmin && (
                    <button
                      className="vendor-delete-btn"
                      onClick={() => handleRemove(vendor._id)}
                      title="Remove vendor"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}

                  <Link to={`/vendor/${vendor._id}`} className="vendor-item-link">
                    <div className="vendor-avatar" style={{ backgroundColor: bg, color }}>
                      {getInitials(vendor.businessName)}
                    </div>
                    <h3 className="vendor-name">{vendor.businessName}</h3>
                    <div className="vendor-rating">
                      <StarRating rating={vendor.rating} numReviews={vendor.numReviews} />
                    </div>
                    {vendor.businessAddress?.city && (
                      <p className="vendor-location">
                        <FaMapMarkerAlt size={12} />
                        <span>{vendor.businessAddress.city}, {vendor.businessAddress.state}</span>
                      </p>
                    )}
                    <p className="vendor-description">
                      {vendor.businessDescription?.length > 90
                        ? vendor.businessDescription.substring(0, 90) + '...'
                        : vendor.businessDescription}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsListPage;