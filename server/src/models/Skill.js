const mongoose = require('mongoose');

// ============= SKILL SCHEMA =============
const skillSchema = new mongoose.Schema({
  // ===== BASIC SKILL INFO =====
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    minlength: [1, 'Skill name must be at least 1 character'],
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  
  // ===== SKILL OFFERING FIELDS =====
  offering: {
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: function() { return this.isOffering; }
    },
    description: {
      type: String,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: ''
    },
    sessions: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  
  // ===== SKILL SEEKING FIELDS =====
  seeking: {
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    currentInstructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    preferredSchedule: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      timeSlots: [{
        start: String,
        end: String
      }]
    }]
  },

  // ===== SKILL TYPE FLAGS =====
  isOffering: {
    type: Boolean,
    default: false
  },
  isSeeking: {
    type: Boolean,
    default: false
  },

  // ===== METADATA =====
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'Programming', 'Design', 'Data Science', 'Marketing', 
      'Language', 'Music', 'Art', 'Business', 'Writing', 
      'Photography', 'Fitness', 'Cooking', 'Other'
    ],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // ===== STATUS =====
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// ============= VALIDATION =============
skillSchema.pre('save', function(next) {
  // Ensure at least one of isOffering or isSeeking is true
  if (!this.isOffering && !this.isSeeking) {
    return next(new Error('Skill must be either offering or seeking (or both)'));
  }
  
  next();
});

// ============= INDEXES FOR PERFORMANCE =============
skillSchema.index({ user: 1 });
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ isOffering: 1 });
skillSchema.index({ isSeeking: 1 });
skillSchema.index({ 'offering.level': 1 });
skillSchema.index({ 'offering.rating': -1 });
skillSchema.index({ tags: 1 });
skillSchema.index({ createdAt: -1 });

// ============= INSTANCE METHODS =============
skillSchema.methods.updateRating = function(newRating) {
  if (this.isOffering) {
    const totalRating = (this.offering.rating * this.offering.sessions) + newRating;
    this.offering.sessions += 1;
    this.offering.rating = totalRating / this.offering.sessions;
  }
};

skillSchema.methods.updateProgress = function(progressValue) {
  if (this.isSeeking) {
    this.seeking.progress = Math.min(100, Math.max(0, progressValue));
  }
};

// ============= STATIC METHODS =============
skillSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

skillSchema.statics.findOfferedSkills = function(userId) {
  return this.find({ user: userId, isOffering: true, isActive: true });
};

skillSchema.statics.findSeekingSkills = function(userId) {
  return this.find({ user: userId, isSeeking: true, isActive: true });
};

skillSchema.statics.searchSkills = function(searchTerm, isOffering = true) {
  return this.find({
    $and: [
      { isActive: true },
      { [isOffering ? 'isOffering' : 'isSeeking']: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { 'offering.description': { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }
    ]
  }).populate('user', 'name avatar rating');
};

// ============= EXPORT MODEL =============
module.exports = mongoose.model('Skill', skillSchema);