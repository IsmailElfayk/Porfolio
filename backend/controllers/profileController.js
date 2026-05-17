const Profile = require('../models/Profile');

const DEFAULTS = {
  name: 'EL FAYK ISMAIL',
  headline: 'Applied Mathematics & MERN Stack Developer',
  subtitle: "Master's Student in Applied Mathematics & Intelligent Systems",
  location: 'Fès, Morocco',
  bio: "Moroccan Master's student in Applied Mathematics and Intelligent Systems at Sidi Mohamed Ben Abdellah University (Fès). Passionate about numerical analysis, partial differential equations, and artificial intelligence, I aim to pursue a PhD exploring the connections between mathematical modeling, numerical methods, and machine learning. I combine mathematical rigor with computational innovation, and also build web applications using the MERN stack.",
  heroTitle: 'From Mathematical Modeling to Full-Stack Web Applications',
  heroSubtitle: 'Bridging numerical analysis, PDEs, and AI with modern web development — turning rigorous mathematics into working software.',
  primaryCTA: 'View Projects',
  primaryCTALink: '/projects',
  openToWork: true,
  bookingFrom: 'July 2026',
  email: 'elfaykismail@gmail.com',
  phone: '+212 6 51 27 55 22',
  timezone: 'UTC+01:00',
  twitter: '',
  linkedin: 'linkedin.com/in/ismail-elfayk',
  github: 'github.com/IsmailElfayk',
  strengths: [
    { icon: '∂', label: 'Mathematical Modeling' },
    { icon: '∫', label: 'Numerical Analysis & Scientific Computing' },
    { icon: '</>', label: 'Web Development (MERN Stack)' },
    { icon: '🧩', label: 'Problem Solving' },
  ],
};

exports.getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create(DEFAULTS);
    res.json(profile);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ ...DEFAULTS, ...req.body });
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true });
    }
    res.json(profile);
  } catch (err) { next(err); }
};
