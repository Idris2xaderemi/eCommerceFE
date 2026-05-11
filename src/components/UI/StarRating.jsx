import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, numReviews }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="star filled" />);
    } else {
      stars.push(<FaStar key={i} className="star" />);
    }
  }
  return (
    <div className="star-rating">
      {stars}
      {numReviews !== undefined && <span className="ml-2 text-gray-500">({numReviews})</span>}
    </div>
  );
};

export default StarRating;