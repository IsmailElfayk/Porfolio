const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  bio:       String,
  image:     String,
  cvFileUrl: String,
  experience: [{
    title:       String,
    company:     String,
    period:      String,
    description: String,
  }],
  education: [{
    degree:      String,
    institution: String,
    period:      String,
    description: String,
  }],
  skills: [{
    name:     String,
    level:    String,
    category: String,
  }],
  strengths: [{
    icon:  String,
    title: String,
  }],
  deskItems: [{
    label: String,
    value: String,
  }],
  talks: [{
    year:  String,
    title: String,
    venue: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
