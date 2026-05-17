const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  heroTitle:      String,
  heroSubtitle:   String,
  heroImage:      String,
  aboutText:      String,
  aboutImage:     String,
  cvFileUrl:      String,
  seoTitle:          String,
  seoDescription:    String,
  footerText:        String,
  mathSectionIntro:  String,
  techSectionIntro:  String,
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
