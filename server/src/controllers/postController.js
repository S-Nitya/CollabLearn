const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'userId',
        select: 'name email avatar',
        model: 'User'
      })
      .sort({ timestamp: -1 });
    
    // Transform posts to include user avatar data
    const transformedPosts = posts.map(post => {
      let userAvatar = null;
      
      // Get avatar from populated user data
      if (post.userId && post.userId.avatar) {
        if (typeof post.userId.avatar === 'string') {
          if (post.userId.avatar.startsWith('http://') || post.userId.avatar.startsWith('https://')) {
            userAvatar = post.userId.avatar;
          } else if (post.userId.avatar.startsWith('data:image/')) {
            userAvatar = post.userId.avatar;
          }
        } else if (typeof post.userId.avatar === 'object') {
          switch (post.userId.avatar.type) {
            case 'upload':
              userAvatar = post.userId.avatar.filename ? `/uploads/avatars/${post.userId.avatar.filename}` : null;
              break;
            case 'url':
              userAvatar = post.userId.avatar.url || null;
              break;
            case 'base64':
              userAvatar = post.userId.avatar.url || null;
              break;
            default:
              userAvatar = null;
          }
        }
      }
      
      return {
        ...post.toObject(),
        authorAvatar: userAvatar || post.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(post.author)}`,
        userInfo: post.userId ? {
          id: post.userId._id,
          name: post.userId.name,
          avatar: post.userId.avatar
        } : null
      };
    });
    
    res.json(transformedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const { author, title, excerpt, tags, authorRole, category, userId } = req.body;

  try {
    // Fetch user data to get the actual avatar
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user avatar using the same logic as getPosts
    let userAvatar = null;
    if (user.avatar) {
      if (typeof user.avatar === 'string') {
        if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
          userAvatar = user.avatar;
        } else if (user.avatar.startsWith('data:image/')) {
          userAvatar = user.avatar;
        }
      } else if (typeof user.avatar === 'object') {
        switch (user.avatar.type) {
          case 'upload':
            userAvatar = user.avatar.filename ? `/uploads/avatars/${user.avatar.filename}` : null;
            break;
          case 'url':
            userAvatar = user.avatar.url || null;
            break;
          case 'base64':
            userAvatar = user.avatar.url || null;
            break;
          default:
            userAvatar = null;
        }
      }
    }

    // Fallback to placeholder if no avatar
    const finalAvatar = userAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(author)}`;

    const newPost = new Post({
      author,
      avatar: finalAvatar,
      title,
      excerpt,
      tags,
      authorRole,
      category,
      userId,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    // Optional: Add authorization check if user ID is provided in headers
    const userId = req.headers['user-id'] || req.body.userId;
    if (userId && post.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to delete this post' 
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Like / Unlike a post
exports.likePost = async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likedBy.includes(userId)) {
      // unlike
      post.likedBy.pull(userId);
      post.stats.likes -= 1;
    } else {
      // like
      post.likedBy.push(userId);
      post.stats.likes += 1;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  const { userId, author, text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, author, text });
    post.stats.comments += 1;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

