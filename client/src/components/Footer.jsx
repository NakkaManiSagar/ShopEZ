import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <Link to="/" className="footer-logo">Shop<span>EZ</span></Link>
        <p>Your one-stop destination for effortless online shopping.</p>
        <div className="footer-socials">
          <a href="https://github.com/NakkaManiSagar/ShopEZ" target="_blank" rel="noreferrer"><Github size={18} /></a>
          <a href="#"><Twitter size={18} /></a>
          <a href="#"><Instagram size={18} /></a>
        </div>
      </div>

      <div className="footer-col">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/products?category=Electronics">Electronics</Link>
        <Link to="/products?category=Clothing">Clothing</Link>
        <Link to="/products?category=Footwear">Footwear</Link>
      </div>

      <div className="footer-col">
        <h4>Account</h4>
        <Link to="/profile">My Profile</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart</Link>
      </div>

      <div className="footer-col">
        <h4>Company</h4>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopEZ. Built with MERN Stack.</p>
    </div>
  </footer>
);

export default Footer;