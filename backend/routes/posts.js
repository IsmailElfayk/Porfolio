const router = require('express').Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');

router.get('/',     getPosts);
router.get('/:id',  getPost);
router.post('/',    auth, createPost);
router.put('/:id',  auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
