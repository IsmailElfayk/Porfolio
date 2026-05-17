const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  slug:             String,
  type:             { type: String, enum: ['project', 'paper', 'writing'], default: 'project' },
  description:      { type: String, default: '' },
  shortDescription: String,
  tags:             [String],
  stack:            [String],
  featured:         { type: Boolean, default: false },
  status:           { type: String, enum: ['published', 'draft'], default: 'published' },
  year:             Number,
  image:            String,
  liveUrl:          String,
  repoUrl:          String,
  link:             String,
  github:           String,
  client:           String,
  overview:         String,
  mathApproach:     String,
  challenges:       String,
  publishedAt:      Date,
  order:            Number,
  rapport:          String,
}, { timestamps: true });

ProjectSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
