const SiteSettings = require('../models/SiteSettings');

const DEFAULTS = {
  heroTitle:      'From Mathematical Modeling to Full-Stack Web Applications',
  heroSubtitle:   'Bridging numerical analysis, PDEs, and AI with modern web development — turning rigorous mathematics into working software.',
  heroImage:      '',
  aboutText:      "Moroccan Master's student in Applied Mathematics and Intelligent Systems at Sidi Mohamed Ben Abdellah University (Fès).",
  aboutImage:     '',
  cvFileUrl:      '',
  seoTitle:         'EL FAYK ISMAIL — Applied Mathematics & MERN Stack',
  seoDescription:   'Applied Mathematics & MERN Stack Developer. Master\'s student specializing in numerical analysis, PDEs, and AI.',
  footerText:       '© 2026 EL FAYK ISMAIL. All rights reserved.',
  mathSectionIntro: 'With a strong foundation in Applied Mathematics, I specialize in numerical analysis, partial differential equations, and mathematical modeling, translating theoretical concepts into practical computational solutions.',
  techSectionIntro: 'Leveraging the MERN stack, I develop robust web applications that integrate scientific computing and data-driven insights.',
};

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create(DEFAULTS);
    res.json(settings);
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ ...DEFAULTS, ...req.body });
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (err) { next(err); }
};
