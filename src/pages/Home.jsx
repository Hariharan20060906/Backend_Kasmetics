import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Fetch featured products (daily offers)
        const featuredResponse = await api.get('/products?featured=true&limit=4');
        dispatch({ type: 'SET_FEATURED_PRODUCTS', payload: featuredResponse.data });
        
        // Fetch best seller
        const bestSellerResponse = await api.get('/products?bestseller=true&limit=1');
        if (bestSellerResponse.data.length > 0) {
          dispatch({ type: 'SET_BEST_SELLER', payload: bestSellerResponse.data[0] });
        }
        
        // Mock reviews data (in real app, this would come from API)
        const mockReviews = [
          {
            id: 1,
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Amazing quality products! My skin has never looked better.',
            product: 'Hydrating Face Serum'
          },
          {
            id: 2,
            name: 'Emily Chen',
            rating: 5,
            comment: 'Fast shipping and excellent customer service. Highly recommended!',
            product: 'Matte Lipstick Set'
          },
          {
            id: 3,
            name: 'Jessica Williams',
            rating: 4,
            comment: 'Great value for money. The foundation matches perfectly.',
            product: 'Full Coverage Foundation'
          }
        ];
        dispatch({ type: 'SET_REVIEWS', payload: mockReviews });
        
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load home data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchHomeData();
  }, [dispatch]);

  const handleProductClick = (productId) => {
    navigate('/products');
    // Scroll to product would be implemented with product ID
    setTimeout(() => {
      const productElement = document.getElementById(`product-${productId}`);
      if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAddToCart = (product) => {
    if (!state.isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">Kasmetics</span>
            </h1>
            <p className="hero-subtitle">
              Discover premium cosmetics and beauty products that enhance your natural beauty
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Offers */}
      <section className="daily-offers">
        <div className="container">
          <h2 className="section-title text-center">Today's Special Offers</h2>
          <p className="section-subtitle">Limited time deals on premium beauty products</p>
          
          {state.loading ? (
            <div className="text-center">
              <div className="loading"></div>
            </div>
          ) : (
            <div className="products-grid">
              {state.featuredProducts.map((product) => (
                <div key={product._id} className="product-card card" onClick={() => handleProductClick(product._id)}>
                  <div className="product-image">
                    <img 
                      src={product.image || '/placeholder-product.jpg'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="offer-badge">Special Offer</div>
                  </div>
                  <div className="card-body">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">${product.price}</div>
                  </div>
                  <div className="card-footer">
                    <button 
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Seller */}
      {state.bestSeller && (
        <section className="best-seller">
          <div className="container">
            <h2 className="section-title text-center">Product of the Month</h2>
            <p className="section-subtitle">Our most loved product this month</p>
            
            <div className="best-seller-card" onClick={() => handleProductClick(state.bestSeller._id)}>
              <div className="best-seller-image">
                <img 
                  src={state.bestSeller.image || '/placeholder-product.jpg'} 
                  alt={state.bestSeller.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
                <div className="bestseller-badge">🏆 Best Seller</div>
              </div>
              <div className="best-seller-content">
                <h3 className="best-seller-name">{state.bestSeller.name}</h3>
                <p className="best-seller-description">{state.bestSeller.description}</p>
                <div className="best-seller-stats">
                  <span className="sales-count">1,000+ sold this month</span>
                  <span className="rating">★★★★★ (4.9/5)</span>
                </div>
                <div className="best-seller-price">${state.bestSeller.price}</div>
                <button 
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(state.bestSeller);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <section className="reviews">
        <div className="container">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real customers</p>
          
          <div className="reviews-grid">
            {state.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div className="reviewer-details">
                      <h4 className="reviewer-name">{review.name}</h4>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="review-comment">"{review.comment}"</p>
                <div className="review-product">Product: {review.product}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Kasmetics?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h3>Premium Quality</h3>
              <p>Only the finest ingredients and materials in all our products</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💝</div>
              <h3>Gift Ready</h3>
              <p>Beautiful packaging perfect for gifting</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure Shopping</h3>
              <p>Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;