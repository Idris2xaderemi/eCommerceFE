import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPendingVendors,
  verifyVendor,
  removeVendor,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getDisputes,
  resolveDispute,
} from '../../store/slices/adminSlice';
import {
  FaStore,
  FaBox,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaSearch,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingVendors, pendingProducts, disputes } = useSelector((state) => state.admin || {});
  const [activeTab, setActiveTab] = useState('vendors');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getPendingVendors());
    dispatch(getPendingProducts());
    dispatch(getDisputes());
  }, [dispatch]);

  // Refresh all data when tab changes
  useEffect(() => {
    dispatch(getPendingVendors());
    dispatch(getPendingProducts());
    dispatch(getDisputes());
  }, [dispatch, activeTab]);

  const handleVerifyVendor = async (id) => {
    try {
      await dispatch(verifyVendor(id)).unwrap();
      toast.success('Vendor verified');
    } catch (err) {
      toast.error(err || 'Failed to verify vendor');
    }
  };

  const handleRemoveVendor = async (id) => {
    if (window.confirm('Remove this vendor?')) {
      try {
        await dispatch(removeVendor(id)).unwrap();
        toast.success('Vendor removed');
      } catch (err) {
        toast.error(err || 'Failed to remove vendor');
      }
    }
  };

  const handleApproveProduct = async (id) => {
    try {
      await dispatch(approveProduct(id)).unwrap();
      toast.success('Product approved');
    } catch (err) {
      toast.error(err || 'Failed to approve product');
    }
  };

  const handleRejectProduct = async (id) => {
    if (window.confirm('Reject and delete this product?')) {
      try {
        await dispatch(rejectProduct(id)).unwrap();
        toast.success('Product rejected');
      } catch (err) {
        toast.error(err || 'Failed to reject product');
      }
    }
  };

  const handleResolveDispute = async (id) => {
    try {
      await dispatch(resolveDispute({ id, resolution: 'Resolved by admin' })).unwrap();
      toast.success('Dispute resolved');
    } catch (err) {
      toast.error(err || 'Failed to resolve dispute');
    }
  };

  // Filter lists based on search term
  const filteredVendors = pendingVendors?.filter(v =>
    v.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = pendingProducts?.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDisputes = disputes?.filter(d =>
    d.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { key: 'vendors', label: 'Vendors', icon: FaStore, count: pendingVendors?.length },
    { key: 'products', label: 'Products', icon: FaBox, count: pendingProducts?.length },
    { key: 'disputes', label: 'Disputes', icon: FaExclamationTriangle, count: disputes?.length },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5>Admin Panel</h5>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`sidebar-link ${activeTab === tab.key ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <tab.icon /> {tab.label}
              <span className="ml-auto">{tab.count ?? 0}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Header with gradient */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
          }}
        >
          <h2 className="mb-1 text-white">
            {activeTab === 'vendors' && 'Pending Vendor Approvals'}
            {activeTab === 'products' && 'Pending Product Approvals'}
            {activeTab === 'disputes' && 'Active Disputes'}
          </h2>
          <p className="text-white text-sm opacity-90">
            {activeTab === 'vendors' && 'Review and verify new vendor registrations.'}
            {activeTab === 'products' && 'Approve or reject products submitted by vendors.'}
            {activeTab === 'disputes' && 'Resolve disputes between customers and vendors.'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-4" style={{ maxWidth: 400 }}>
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="grid grid-2 gap-4">
            {filteredVendors?.length === 0 ? (
              <div className="col-span-full card p-4 text-center">
                <FaStore className="text-gray-300 mb-3" size={48} />
                <h4>No pending vendors</h4>
                <p className="text-gray-500">All vendor registrations have been reviewed.</p>
              </div>
            ) : (
              filteredVendors?.map((vendor) => (
                <div key={vendor._id} className="card flex flex-row gap-3 p-4">
                  <div
                    className="rounded-full bg-primary text-white flex items-center justify-center"
                    style={{ width: 50, height: 50, fontSize: '1.5rem', fontWeight: 700, minWidth: 50 }}
                  >
                    {vendor.businessName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4>{vendor.businessName}</h4>
                    <p className="text-gray-500 text-sm">{vendor.businessEmail}</p>
                    <p className="text-gray-500 text-sm">{vendor.businessAddress?.city}, {vendor.businessAddress?.state}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleVerifyVendor(vendor._id)}
                        className="btn btn-sm btn-success"
                      >
                        <FaCheckCircle className="mr-1" /> Verify
                      </button>
                      <button
                        onClick={() => handleRemoveVendor(vendor._id)}
                        className="btn btn-sm btn-danger"
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-2 gap-4">
            {filteredProducts?.length === 0 ? (
              <div className="col-span-full card p-4 text-center">
                <FaBox className="text-gray-300 mb-3" size={48} />
                <h4>No pending products</h4>
                <p className="text-gray-500">All product submissions have been reviewed.</p>
              </div>
            ) : (
              filteredProducts?.map((product) => (
                <div key={product._id} className="card flex flex-row gap-3 p-4">
                  <div
                    className="rounded-lg bg-gray-100"
                    style={{
                      width: 80,
                      height: 80,
                      minWidth: 80,
                      backgroundImage: `url(${product.images?.[0]?.url || '/images/placeholder.png'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="flex-1">
                    <h4>{product.name}</h4>
                    <p className="text-primary fw-bold">₦{product.price?.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">Vendor: {product.vendor?.businessName}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApproveProduct(product._id)}
                        className="btn btn-sm btn-success"
                      >
                        <FaCheckCircle className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectProduct(product._id)}
                        className="btn btn-sm btn-danger"
                      >
                        <FaTimesCircle className="mr-1" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Disputes Tab */}
        {activeTab === 'disputes' && (
          <div className="grid gap-4">
            {filteredDisputes?.length === 0 ? (
              <div className="card p-4 text-center">
                <FaExclamationTriangle className="text-gray-300 mb-3" size={48} />
                <h4>No active disputes</h4>
                <p className="text-gray-500">All disputes have been resolved.</p>
              </div>
            ) : (
              filteredDisputes?.map((dispute) => (
                <div key={dispute._id} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4>Order #{dispute.order?._id?.slice(-8)}</h4>
                      <p className="text-gray-500 text-sm">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveDispute(dispute._id)}
                        className="btn btn-sm btn-success"
                      >
                        <FaCheckCircle className="mr-1" /> Resolve
                      </button>
                    </div>
                  </div>
                  <p><strong>Reason:</strong> {dispute.reason}</p>
                  <p className="text-gray-600">{dispute.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;