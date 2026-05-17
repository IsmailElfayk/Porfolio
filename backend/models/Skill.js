const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  icon:        String,
  image:       String,
  category:    String,
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
