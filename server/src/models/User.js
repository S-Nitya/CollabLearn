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

  // ===== PROFILE INFO =====
  avatar: {
    type: {
      type: String,
      enum: ['default', 'upload', 'url', 'base64'],
      default: 'default'
    },
    url: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: ''
    },
    uploadDate: {
      type: Date,
      default: null
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },

  // ===== SKILLS REFERENCE =====
  // Skills are now stored in separate Skill model
  // Use virtual populate to access user's skills

  // ===== RATINGS & STATISTICS =====
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
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
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
userSchema.index({ 'rating.average': -1 });

// ============= VIRTUAL POPULATE FOR SKILLS =============
userSchema.virtual('skillsOffering', {
  ref: 'Skill',
  localField: '_id',
  foreignField: 'user',
  match: { isOffering: true, isActive: true }
});

userSchema.virtual('skillsSeeking', {
  ref: 'Skill',
  localField: '_id',
  foreignField: 'user',
  match: { isSeeking: true, isActive: true }
});

userSchema.virtual('allSkills', {
  ref: 'Skill',
  localField: '_id',
  foreignField: 'user',
  match: { isActive: true }
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// ============= AVATAR UTILITIES =============
// Helper method to get avatar URL
userSchema.methods.getAvatarUrl = function() {
  if (!this.avatar) {
    return null;
  }
  
  switch (this.avatar.type) {
    case 'upload':
      return this.avatar.url ? `/uploads/avatars/${this.avatar.filename}` : null;
    case 'url':
      return this.avatar.url;
    case 'base64':
      return this.avatar.url;
    case 'default':
    default:
      return null;
  }
};

// Helper method to set avatar
userSchema.methods.setAvatar = function(avatarData) {
  if (!avatarData) {
    this.avatar = {
      type: 'default',
      url: '',
      filename: '',
      uploadDate: null
    };
    return;
  }
  
  if (typeof avatarData === 'string') {
    if (avatarData === 'default' || avatarData === '') {
      this.avatar = {
        type: 'default',
        url: '',
        filename: '',
        uploadDate: null
      };
    } else if (avatarData.startsWith('data:image/')) {
      // Base64 image
      this.avatar = {
        type: 'base64',
        url: avatarData,
        filename: '',
        uploadDate: new Date()
      };
    } else if (avatarData.startsWith('http://') || avatarData.startsWith('https://')) {
      // External URL
      this.avatar = {
        type: 'url',
        url: avatarData,
        filename: '',
        uploadDate: new Date()
      };
    } else {
      // Local file path/filename
      this.avatar = {
        type: 'upload',
        url: '',
        filename: avatarData,
        uploadDate: new Date()
      };
    }
  } else if (typeof avatarData === 'object') {
    // Full avatar object
    this.avatar = {
      type: avatarData.type || 'default',
      url: avatarData.url || '',
      filename: avatarData.filename || '',
      uploadDate: avatarData.uploadDate || new Date()
    };
  }
};

// Virtual for backward compatibility
userSchema.virtual('avatarUrl').get(function() {
  return this.getAvatarUrl();
});

// ============= EXPORT MODEL =============
module.exports = mongoose.model('User', userSchema);