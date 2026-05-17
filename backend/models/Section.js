const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  intro:       { type: String, default: '' },
  visible:     { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  slug:        { type: String },
  isDeletable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Section', SectionSchema);
