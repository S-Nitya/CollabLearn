const User = require('../models/User');
const Admin = require('../models/Admin');
const Availability = require('../models/Availability');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

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

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'User with this email already exists' 
        });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword
      });

      await user.save();

      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.getAvatarUrl(),
          avatarType: user.avatar?.type,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
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

  login: async (req, res) => {
    try {
      const { email, password, role = 'user' } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email and password are required' 
        });
      }

      let user;
      let userRole;

      if (role === 'admin') {
        // Authenticate against Admin model
        user = await Admin.findOne({ email: email.toLowerCase() });
        userRole = 'admin';
        
        if (!user) {
          return res.status(401).json({ 
            success: false,
            message: 'Invalid admin credentials'
          });
        }

        if (!user.isActive) {
          return res.status(401).json({ 
            success: false,
            message: 'Admin account is deactivated. Please contact support.' 
          });
        }
      } else {
        // Authenticate against User model
        user = await User.findOne({ email: email.toLowerCase() });
        userRole = 'user';
        
        if (!user) {
          return res.status(401).json({ 
            success: false,
            message: 'Invalid email or password'
          });
        }

        if (!user.isActive) {
          return res.status(401).json({ 
            success: false,
            message: 'Account is deactivated. Please contact support.' 
          });
        }
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: role === 'admin' ? 'Invalid admin credentials' : 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: userRole
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );

      const responseUser = {
        id: user._id,
        email: user.email,
        role: userRole
      };

      // Add additional fields for regular users
      if (role === 'user') {
        responseUser.name = user.name;
        responseUser.avatar = user.getAvatarUrl();
        responseUser.avatarType = user.avatar?.type;
        responseUser.createdAt = user.createdAt;
      } else {
        // For admin, set a default name
        responseUser.name = 'Admin';
        responseUser.avatar = null;
        responseUser.avatarType = 'default';
        responseUser.createdAt = user.createdAt;
      }

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: responseUser
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

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId)
        .select('-password')
        .populate('skillsOffering')
        .populate('skillsSeeking');
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      const availability = await Availability.getUserAvailability(req.userId);

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.getAvatarUrl(),
          avatarType: user.avatar?.type,
          bio: user.bio,
          skillsOffering: user.skillsOffering,
          skillsSeeking: user.skillsSeeking,
          availability: availability,
          rating: user.rating,
          totalSessions: user.totalSessions,
          badges: user.badges,
          joinDate: user.createdAt,
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
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.userId;
      const { name, bio, avatar } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Update basic fields
      if (name) user.name = name.trim();
      if (bio !== undefined) user.bio = bio.trim();
      
      // Update avatar using the new helper method
      if (avatar !== undefined) {
        user.setAvatar(avatar);
      }

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.getAvatarUrl(), // Use the helper method
          avatarType: user.avatar?.type,
          rating: user.rating,
          totalSessions: user.totalSessions,
          badges: user.badges,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  },

  // DELETE /api/auth/delete - Permanently delete current user's account and related data
  deleteAccount: async (req, res) => {
    try {
      const userId = req.userId;

      // Basic safety: ensure user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Remove related documents that reference the user.
      // Use require here to avoid circular requires at module top if any.
      const Skill = require('../models/Skill');
      const Post = require('../models/Post');
      const Message = require('../models/Message');
      const Booking = require('../models/Booking');
      const Availability = require('../models/Availability');

      // Delete skills created by user
      await Skill.deleteMany({ user: userId });

      // Delete posts authored by user
      await Post.deleteMany({ userId: userId });

      // Delete messages sent by user (chat history may be kept in real apps)
      await Message.deleteMany({ $or: [ { senderId: String(userId) }, { senderId: user.email } ] });

      // Remove bookings where user is student or instructor
      await Booking.deleteMany({ $or: [ { student: userId }, { instructor: userId } ] });

      // Remove availability entries
      await Availability.deleteMany({ userId: userId });

      // Finally remove the user
      await User.findByIdAndDelete(userId);

      res.json({ success: true, message: 'Account and related data deleted successfully' });

    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ success: false, message: 'Server error deleting account' });
    }
  },

  // Get user by ID (public route for profile viewing)
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId)
        .select('-password')
        .populate('skillsOffering')
        .populate('skillsSeeking');
      
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
          avatarUrl: user.getAvatarUrl(),
          avatarType: user.avatar?.type,
          bio: user.bio,
          skillsOffering: user.skillsOffering,
          skillsSeeking: user.skillsSeeking,
          rating: user.rating,
          totalSessions: user.totalSessions,
          badges: user.badges,
          joinDate: user.createdAt,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

};

module.exports = authController;