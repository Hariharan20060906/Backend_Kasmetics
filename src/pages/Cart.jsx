import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Cart.css';

const Cart = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title">Shopping Cart</h1>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-content">
              <div className="empty-cart-icon">🔒</div>
              <h3>Please login to view your cart</h3>
              <p>You need to be logged in to add items to cart and make purchases.</p>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity: newQuantity } });
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToPurchase = () => {
    alert(`Purchase successful! Total: $${calculateTotal()}\nThank you for shopping with Kasmetics!`);
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title">Shopping Cart</h1>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-content">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <a href="/products" className="btn btn-primary">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="cart-summary">
            {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {state.cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/placeholder-product.jpg'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  {item.category && (
                    <span className="item-category">{item.category}</span>
                  )}
                </div>
                
                <div className="item-price">
                  <span className="price">${item.price}</span>
                </div>
                
                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    >
                      –
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item._id)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-sidebar">
            <div className="cart-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
              
              <button 
                className="proceed-btn"
                onClick={handleProceedToPurchase}
              >
                Proceed to Purchase
              </button>
              
              <a href="/products" className="continue-shopping">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;