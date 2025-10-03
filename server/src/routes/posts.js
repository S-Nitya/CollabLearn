const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost, likePost, addComment, getPostById } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/comment', addComment);


module.exports = router;
