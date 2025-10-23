const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = async (req, res) => {
  try {
    // Pagination params
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate({
          path: 'userId',
          select: 'name email avatar',
          model: 'User'
        })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({})
    ]);

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
          } else {
            userAvatar = `/uploads/avatars/${post.userId.avatar}`;
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
        ...post,
        authorAvatar: userAvatar || post.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(post.author)}`,
        userInfo: post.userId ? {
          id: post.userId._id,
          name: post.userId.name,
          avatar: post.userId.avatar
        } : null
      };
    });
    
    res.json({
      success: true,
      page,
      limit,
      total,
      posts: transformedPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Top Contributors (users with most posts)
exports.getTopContributors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    // Aggregate posts grouped by userId and join with users to get names
    const agg = await Post.aggregate([
      { $group: { _id: '$userId', totalPosts: { $sum: 1 } } },
      { $sort: { totalPosts: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      // Exclude posts where the user no longer exists
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
      // Exclude empty names and anonymous users
      {
        $match: {
          'user.name': { $nin: ['', null] },
          // Case-insensitive filter to remove anonymous names
          $expr: {
            $not: {
              $regexMatch: { input: { $toLower: '$user.name' }, regex: /^anonymous(\s+user)?$/ }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          totalPosts: 1,
          name: '$user.name',
          avatar: '$user.avatar'
        }
      },
      { $limit: limit }
    ]);

    const resolveAvatarUrl = (avatar, name) => {
      try {
        if (!avatar) return `https://i.pravatar.cc/150?u=${encodeURIComponent(name || 'User')}`;
        if (typeof avatar === 'string') {
          if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image/')) {
            return avatar;
          }
          // Treat as uploaded filename path
          return `/uploads/avatars/${avatar}`;
        }
        if (typeof avatar === 'object') {
          switch (avatar.type) {
            case 'upload':
              return avatar.filename ? `/uploads/avatars/${avatar.filename}` : `https://i.pravatar.cc/150?u=${encodeURIComponent(name || 'User')}`;
            case 'url':
            case 'base64':
              return avatar.url || `https://i.pravatar.cc/150?u=${encodeURIComponent(name || 'User')}`;
            default:
              return `https://i.pravatar.cc/150?u=${encodeURIComponent(name || 'User')}`;
          }
        }
        return `https://i.pravatar.cc/150?u=${encodeURIComponent(name || 'User')}`;
      } catch (e) {
        return `https://i.pravatar.cc/150?u=${encodeURIComponent(name || 'User')}`;
      }
    };

    // Final safety filter on server side to ensure no anonymous or duplicates
    const anonRe = /^anonymous(?:\s+user)?$/i;
    const seen = new Set();
    const result = [];
    for (const row of agg) {
      if (!row?.userId || !row?.name || anonRe.test(row.name)) continue;
      const key = row.userId.toString();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({
        userId: row.userId,
        name: row.name,
        avatar: row.avatar || null,
        avatarUrl: resolveAvatarUrl(row.avatar, row.name),
        totalPosts: row.totalPosts
      });
    }

    res.json({ success: true, contributors: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

