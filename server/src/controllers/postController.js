const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const { author, avatar, title, excerpt, tags, authorRole, category, userId } = req.body;

  const newPost = new Post({
    author,
    avatar,
    title,
    excerpt,
    tags,
    authorRole,
    category,
    userId,
  });

  try {
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
      return res.status(404).json({ message: 'Post not found' });
    }

    // TODO: Add authorization check to ensure the user deleting the post is the author.
    // For example: if (post.author.toString() !== req.user.id) { ... }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

