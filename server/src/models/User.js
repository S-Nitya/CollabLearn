const mongoose = require('mongoose');

// ============= USER SCHEMA =============
const userSchema = new mongoose.Schema({
  // ===== BASIC INFO (Required for signup) =====
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // ===== PROFILE INFO (Optional - to be implemented later) =====
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },

  // ===== SKILLS (To be implemented later) =====
  skillsOffering: [{
    skill: String,
    category: {
      type: String,
      enum: ['coding', 'academics', 'other']
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    tags: [String]
  }],
  
  skillsLearning: [{
    skill: String,
    category: {
      type: String,
      enum: ['coding', 'academics', 'other']
    },
    desiredLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  }],

  // ===== AVAILABILITY (To be implemented later) =====
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String
  }],

  // ===== RATINGS & REPUTATION (To be implemented later) =====
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  badges: [String],

  // ===== STATUS =====
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// ============= INDEXES FOR PERFORMANCE =============
userSchema.index({ email: 1 });
userSchema.index({ 'skillsOffering.skill': 1 });
userSchema.index({ 'skillsOffering.category': 1 });

// ============= EXPORT MODEL =============
module.exports = mongoose.model('User', userSchema);