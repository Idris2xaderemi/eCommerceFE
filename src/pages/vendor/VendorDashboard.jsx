import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaChartLine, FaBox, FaPlus, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import VendorOverview from './VendorOverview';   // we'll create this next

const VendorDashboard = () => {
  const location = useLocation();

  const links = [
    { to: '/vendor/dashboard', label: 'Overview',     icon: FaChartLine, exact: true },
    { to: '/vendor/dashboard/products', label: 'Products', icon: FaBox },
    { to: '/vendor/dashboard/add-product', label: 'Add Product', icon: FaPlus },
    { to: '/vendor/dashboard/orders', label: 'Orders', icon: FaShoppingCart },
    { to: '/vendor/dashboard/payments', label: 'Payments', icon: FaDollarSign },
  ];

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5>Vendor Panel</h5>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${
                (link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to)) ? 'active' : ''
              }`}
            >
              <link.icon /> {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="dashboard-content">
        {/* Show overview only on the exact /vendor/dashboard path */}
        {location.pathname === '/vendor/dashboard' ? <VendorOverview /> : <Outlet />}
      </div>
    </div>
  );
};

export default VendorDashboard;
