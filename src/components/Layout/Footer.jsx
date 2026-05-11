import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaAmazon } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1 – Brand + Social */}
          <div className="footer-menu">
            <h3 className="text-white fs-4 mb-3">KaraKata</h3>
            <div className="social-links d-flex gap-2">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaAmazon /></a>
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div className="footer-menu">
            <h5>KaraKata</h5>
            <ul>
              <li><Link to="/about-us">About us</Link></li>
              <li><Link to="/conditions">Conditions</Link></li>
              <li><Link to="/our-journals">Our Journals</Link></li>
            </ul>
          </div>

          {/* Column 3 – Quick Links 2 */}
          <div className="footer-menu">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/stores">Stores</Link></li>
              <li><Link to="/dashboard">Track Order</Link></li>
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/info">Info</Link></li>
            </ul>
          </div>

          {/* Column 4 – Customer Service */}
          <div className="footer-menu">
            <h5>Customer Service</h5>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/returns-refunds">Returns & Refunds</Link></li>
              <li><Link to="/delivery-information">Delivery Information</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 KaraKata. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;