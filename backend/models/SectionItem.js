const mongoose = require('mongoose');

const SectionItemSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  shortDescription: { type: String, default: '' },
  image:            { type: String, default: '' },
  rapport:          { type: String, default: '' },
  section:          { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  order:            { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SectionItem', SectionItemSchema);
