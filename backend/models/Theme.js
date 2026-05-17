const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  image:       String,
  description: String,
  slug:        { type: String, unique: true },
  order:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now },
}, { timestamps: true });

ThemeSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

ThemeSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
  const update = this.getUpdate();
  if (update && update.title && !update.slug) {
    update.slug = update.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Theme', ThemeSchema);
