const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, default: 'General inquiry' },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
