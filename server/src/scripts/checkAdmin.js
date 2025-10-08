const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collablearn');
    console.log('Connected to MongoDB');

    // Find the admin
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });
    
    if (admin) {
      console.log('Admin found:');
      console.log('ID:', admin._id);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('IsActive:', admin.isActive);
      console.log('Created:', admin.createdAt);
      console.log('Password Hash Length:', admin.password.length);
    } else {
      console.log('No admin found with email admin@gmail.com');
    }

    // Also count all admins
    const adminCount = await Admin.countDocuments();
    console.log('Total admin count:', adminCount);

  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

checkAdmin();