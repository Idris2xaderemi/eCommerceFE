import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, message, linkTo, linkText }) => (
  <div className="text-center p-4">
    {Icon && <Icon className="mb-3" style={{ fontSize: '3rem', color: 'var(--gray-400)' }} />}
    <h3 className="mb-2">{title}</h3>
    <p className="text-gray-500 mb-3">{message}</p>
    {linkTo && <Link to={linkTo} className="btn btn-primary">{linkText}</Link>}
  </div>
);

export default EmptyState;