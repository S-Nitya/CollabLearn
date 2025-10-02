// Import required packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

// ============= MIDDLEWARE =============
// Middleware runs BEFORE your route handlers

// 1. CORS - Cross-Origin Resource Sharing
app.use(cors());
// Why? Your React app (port 3000) needs to talk to your server (port 5000)
// Without CORS, browsers block these cross-origin requests for security

// 2. JSON Parser with increased limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Why? Converts incoming JSON data to JavaScript objects
// Increased limit to handle base64 encoded images

// ============= DATABASE CONNECTION =============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Shubham:12345@collablearn.kppefxo.mongodb.net/collablearn?retryWrites=true&w=majority&appName=CollabLearn';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Atlas connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Disconnected from MongoDB Atlas');
});

// ============= ROUTES =============
// Authentication routes (login, register)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/skills', require('./routes/skills'));

// ============= ROOT ROUTE =============
// Test route to check if server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'CollabLearn API Server Running!',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      getPosts: 'GET /api/posts',
      createPost: 'POST /api/posts'
    }
  });
});

// ============= START SERVER =============
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Test at: http://localhost:${PORT}`);
});