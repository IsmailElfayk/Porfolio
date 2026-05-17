const Post = require('../models/Post');

exports.getPosts = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const posts = await Post.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    res.json(posts);
  } catch (err) { next(err); }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) { next(err); }
};

exports.createPost = async (req, res, next) => {
  try {
    if (req.body.status === 'published' && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
  try {
    if (req.body.status === 'published' && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
