const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  year:             { type: Number, required: true },
  title:            { type: String, required: true },
  shortDescription: { type: String, default: '' },
  authors:          String,
  venue:            String,
  tags:             [String],
  abstract:         String,
  status:           { type: String, enum: ['published', 'submitted', 'draft'], default: 'published' },
  doi:              String,
  pdfUrl:           String,
  bibtex:           String,
}, { timestamps: true });

module.exports = mongoose.model('Paper', PaperSchema);
