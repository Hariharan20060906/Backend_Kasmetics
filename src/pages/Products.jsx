import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import './Products.css';

const Products = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await api.get('/products?limit=20');
        dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        setFilteredProducts(response.data);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const filtered = state.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, state.products]);

  const handleAddToCart = (product) => {
    if (!state.isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleQuantityChange = (productId, change) => {
    if (!state.isAuthenticated) {
      alert('Please login to modify cart');
      return;
    }
    const cartItem = state.cart.find(item => item._id === productId);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity: newQuantity } });
    }
  };

  const getCartQuantity = (productId) => {
    const cartItem = state.cart.find(item => item._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">
            Discover our complete collection of premium cosmetics and beauty products
          </p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
        </div>

        {state.loading ? (
          <div className="loading-container">
            <div className="loading"></div>
            <p>Loading products...</p>
          </div>
        ) : state.error ? (
          <div className="error-container">
            <div className="error-message">
              <h3>Oops! Something went wrong</h3>
              <p>{state.error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-content">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>
                {searchTerm 
                  ? `No products match "${searchTerm}". Try a different search term.`
                  : 'No products available at the moment.'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="products-count">
              <p>Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
            </div>
            
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const cartQuantity = getCartQuantity(product._id);
                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={product.image || '/placeholder-product.jpg'} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      {product.isNew && <span className="product-badge new">New</span>}
                      {product.onSale && <span className="product-badge sale">Sale</span>}
                    </div>
                    
                    <div className="product-content">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-details">
                        {product.category && (
                          <span className="product-category">{product.category}</span>
                        )}
                        {product.brand && (
                          <span className="product-brand">{product.brand}</span>
                        )}
                      </div>
                      
                      <div className="product-price-section">
                        {product.originalPrice && product.originalPrice > product.price ? (
                          <div className="price-with-discount">
                            <span className="original-price">${product.originalPrice}</span>
                            <span className="current-price">${product.price}</span>
                          </div>
                        ) : (
                          <div className="current-price">${product.price}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      {cartQuantity === 0 ? (
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(product._id, -1)}
                          >
                            –
                          </button>
                          <span className="quantity-display">{cartQuantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(product._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;