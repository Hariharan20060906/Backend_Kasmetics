const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@kasmetics.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@kasmetics.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    // Create sample products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'Hydrating Face Serum',
          description: 'Premium hydrating serum for all skin types',
          price: 45.99,
          category: 'Skincare',
          brand: 'Kasmetics',
          featured: true,
          bestseller: true,
          sales: 156
        },
        {
          name: 'Matte Lipstick Set',
          description: 'Long-lasting matte lipstick in 6 beautiful shades',
          price: 29.99,
          category: 'Makeup',
          brand: 'Kasmetics',
          featured: true,
          sales: 89
        },
        {
          name: 'Full Coverage Foundation',
          description: 'Buildable coverage foundation for flawless skin',
          price: 38.50,
          category: 'Makeup',
          brand: 'Kasmetics',
          sales: 134
        },
        {
          name: 'Vitamin C Brightening Cream',
          description: 'Brightening cream with vitamin C and antioxidants',
          price: 52.00,
          category: 'Skincare',
          brand: 'Kasmetics',
          featured: true,
          sales: 67
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products created');
    }

    console.log('🎉 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();