const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name:          String,
  headline:      String,
  subtitle:      String,
  location:      String,
  bio:           String,
  heroTitle:     String,
  heroSubtitle:  String,
  primaryCTA:    String,
  primaryCTALink:String,
  openToWork:    { type: Boolean, default: true },
  bookingFrom:   String,
  email:         String,
  phone:         String,
  timezone:      String,
  twitter:       String,
  linkedin:      String,
  github:        String,
  orcid:         String,
  strengths:     [{ icon: String, label: String }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
