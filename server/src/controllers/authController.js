const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ============= AUTHENTICATION CONTROLLER =============
const authController = {
  
  // ===== USER REGISTRATION =====
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // 1. VALIDATION
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'All fields (name, email, password) are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false,
          message: 'Password must be at least 6 characters long' 
        });
      }

      // 2. CHECK IF USER ALREADY EXISTS
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'User with this email already exists' 
        });
      }

      // 3. HASH PASSWORD (NEVER store plain text passwords!)
      const saltRounds = 12; // Higher = more secure but slower
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 4. CREATE NEW USER
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword
      });

      await user.save();

      // 5. GENERATE JWT TOKEN
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }  // Token expires in 7 days
      );

      // 6. SEND SUCCESS RESPONSE (Never send password back!)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
   
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle duplicate email error from MongoDB
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already exists' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // ===== USER LOGIN =====
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. VALIDATION
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email and password are required' 
        });
      }

      // 2. FIND USER BY EMAIL
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password'  // Don't reveal which is wrong
        });
      }

      // 3. CHECK IF ACCOUNT IS ACTIVE
      if (!user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: 'Account is deactivated. Please contact support.' 
        });
      }

      // 4. VERIFY PASSWORD
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password'  // Don't reveal which is wrong
        });
      }

      // 5. GENERATE JWT TOKEN
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );

      // 6. SEND SUCCESS RESPONSE
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // ===== GET CURRENT USER (Protected route) =====
  getCurrentUser: async (req, res) => {
    try {
      // req.userId is set by auth middleware
      const user = await User.findById(req.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          skillsOffering: user.skillsOffering,
          skillsLearning: user.skillsLearning,
          rating: user.rating,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = authController;