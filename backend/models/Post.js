const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  summary:     String,
  body:        String,
  tag:         String,
  readTime:    String,
  featured:    { type: Boolean, default: false },
  status:      { type: String, enum: ['published', 'draft'], default: 'draft' },
  publishedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
