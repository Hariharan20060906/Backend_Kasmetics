const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/users', adminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Most sold product
    const mostSoldProduct = await Product.findOne().sort({ sales: -1 });
    
    // Mock analytics data (replace with real data from orders collection)
    const analytics = {
      totalUsers,
      totalProducts,
      totalSales: 15420.50,
      totalOrders: 156,
      mostSoldProduct: mostSoldProduct ? {
        name: mostSoldProduct.name,
        sales: mostSoldProduct.sales || 45
      } : null,
      topCustomer: {
        name: 'Sarah Johnson',
        totalSpent: 1250.00
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;