import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state, dispatch } = useApp();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getTotalItems = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            Kasmetics
          </Link>
          
          <button 
            className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/')}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`navbar-link ${isActive('/products')}`}
              onClick={closeMenu}
            >
              Products
            </Link>
            
            {state.isAuthenticated ? (
              <>
                <Link 
                  to="/cart" 
                  className={`navbar-link cart-link ${isActive('/cart')}`}
                  onClick={closeMenu}
                >
                  Cart
                  {getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </Link>
                
                {state.userRole === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`navbar-link ${isActive('/admin')}`}
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                
                <div className="user-menu">
                  <span className="user-name">Hi, {state.user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="navbar-link logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login')}`}
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
            
            <Link 
              to="/contact" 
              className={`navbar-link ${isActive('/contact')}`}
              onClick={closeMenu}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;