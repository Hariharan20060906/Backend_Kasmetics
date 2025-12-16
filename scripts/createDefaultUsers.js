const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@kasmetics.com',
    password: 'Admin@123',
    role: 'admin'
  },
  {
    name: 'Test User',
    email: 'user@kasmetics.com',
    password: 'User@123',
    role: 'user'
  }
];

const createDefaultUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    console.log('\n🎉 Default users setup complete!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 ADMIN LOGIN:');
    console.log('   Email: admin@kasmetics.com');
    console.log('   Password: Admin@123');
    console.log('');
    console.log('👤 USER LOGIN:');
    console.log('   Email: user@kasmetics.com');
    console.log('   Password: User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Error creating default users:', error);
    process.exit(1);
  }
};

createDefaultUsers();