import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import './Admin.css';

const Admin = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    image: ''
  });
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load users' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchAnalytics = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load analytics' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      await fetchProducts();
      resetForm();
      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      alert('Failed to save product. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.post('/admin/users', userFormData);
      await fetchUsers();
      resetUserForm();
      alert('User added successfully!');
    } catch (error) {
      alert('Failed to add user. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || '',
      brand: product.brand || '',
      image: product.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.delete(`/products/${productId}`);
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Failed to delete product. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (error) {
      alert('Failed to delete user. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', brand: '', image: '' });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const resetUserForm = () => {
    setUserFormData({ name: '', email: '', password: '' });
    setShowAddUserForm(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
        </div>

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showAddForm && (
              <div className="form-container">
                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Product Name"
                      className="form-input"
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      className="form-input"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Category"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Brand"
                      className="form-input"
                    />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="form-input"
                    rows="3"
                    required
                  />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                    className="form-input"
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? 'Update' : 'Add'} Product
                    </button>
                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.image || '/placeholder-product.jpg'} 
                          alt={product.name}
                          className="table-image"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(product)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddUserForm(!showAddUserForm)}
              >
                {showAddUserForm ? 'Cancel' : 'Add User'}
              </button>
            </div>

            {showAddUserForm && (
              <div className="form-container">
                <form onSubmit={handleUserSubmit} className="admin-form">
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      value={userFormData.name}
                      onChange={handleUserInputChange}
                      placeholder="Full Name"
                      className="form-input"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={userFormData.email}
                      onChange={handleUserInputChange}
                      placeholder="Email"
                      className="form-input"
                      required
                    />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={userFormData.password}
                    onChange={handleUserInputChange}
                    placeholder="Password"
                    className="form-input"
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Add User
                    </button>
                    <button type="button" onClick={resetUserForm} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role || 'user'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Most Sold Product</h3>
                <div className="card-content">
                  <h4>{analytics.mostSoldProduct?.name || 'N/A'}</h4>
                  <p>{analytics.mostSoldProduct?.sales || 0} sales</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Top Customer</h3>
                <div className="card-content">
                  <h4>{analytics.topCustomer?.name || 'N/A'}</h4>
                  <p>${analytics.topCustomer?.totalSpent || 0} spent</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Total Sales</h3>
                <div className="card-content">
                  <h4>${analytics.totalSales || 0}</h4>
                  <p>{analytics.totalOrders || 0} orders</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Total Users</h3>
                <div className="card-content">
                  <h4>{analytics.totalUsers || 0}</h4>
                  <p>Registered users</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.loading && (
          <div className="loading-overlay">
            <div className="loading"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;