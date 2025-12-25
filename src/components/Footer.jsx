import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">About Kasmetics</h3>
            <p className="footer-text">
              Kasmetics is your premier destination for high-quality cosmetics and beauty products. 
              We offer a curated selection of makeup, skincare, and beauty accessories.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contact Details</h3>
            <div className="contact-info">
              <p className="contact-item">
                <span className="contact-label">Email:</span>
                <a href="mailto:kasmetics@gmail.com" className="contact-link">
                  kasmetics@gmail.com
                </a>
              </p>
              <p className="contact-item">
                <span className="contact-label">Phone:</span>
                <a href="tel:+919182736450" className="contact-link">
                  +91 9182736450
                </a>
              </p>
              <p className="contact-item">
                <span className="contact-label">Address:</span>
                123 Beauty Street, Cosmetics City, CC 12345
              </p>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <div className="footer-links">
              <a href="/products" className="footer-link">Products</a>
              <a href="/contact" className="footer-link">Contact Us</a>
              <a href="/cart" className="footer-link">Shopping Cart</a>
              <a href="/login" className="footer-link">Login</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="copyright">
            Copyright © {currentYear} Kasmetics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;