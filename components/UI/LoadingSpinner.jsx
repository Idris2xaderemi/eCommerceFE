const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p className="mt-2 text-gray-500">{message}</p>
  </div>
);

export default LoadingSpinner;