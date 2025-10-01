const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  stats: {
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isHot: {
    type: Boolean,
    default: false,
  },
  authorRole: {
    type: String,
  },
  category: {
    type: String,
  },
  userId: {
    type: String, // In a real app, this would be mongoose.Schema.Types.ObjectId and ref: 'User'
    required: true,
  },
});

module.exports = mongoose.model('Post', postSchema);
