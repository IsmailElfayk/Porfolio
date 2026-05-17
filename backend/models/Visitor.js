const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  key:   { type: String, default: 'global', unique: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Visitor', visitorSchema);
