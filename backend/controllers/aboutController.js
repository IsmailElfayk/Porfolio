const About = require('../models/About');

const DEFAULTS = {
  bio: "Moroccan Master's student in Applied Mathematics and Intelligent Systems at Sidi Mohamed Ben Abdellah University (Fès). Passionate about numerical analysis, partial differential equations, and artificial intelligence, I aim to pursue a PhD exploring the connections between mathematical modeling, numerical methods, and machine learning. I combine mathematical rigor with computational innovation, and also build web applications using the MERN stack.",
  image: '',
  cvFileUrl: '',
  experience: [],
  education: [
    { degree: "Master's Degree in Applied Mathematics & Intelligent Systems (ongoing)", institution: 'Faculty of Sciences Dhar El Mahraz — SMSBU, Fès', period: '2024 — 2026', description: '' },
    { degree: 'Bachelor\'s Degree in Applied Mathematics (Numerical Analysis)', institution: 'Faculty of Sciences Dhar El Mahraz — SMSBU, Fès', period: '2024', description: '' },
    { degree: 'DEUG in Applied Mathematics', institution: 'Faculty of Sciences Dhar El Mahraz — SMSBU, Fès', period: '2020 — 2023', description: '' },
    { degree: 'High School Diploma in Mathematical Sciences A', institution: 'Ibn Khaldoun High School, Karia Ba Mohamed, Taounate', period: '2020', description: '' },
  ],
  skills: [
    { name: 'MATLAB', level: 'Expert', category: 'Scientific Computing' },
    { name: 'Python', level: 'Expert', category: 'Scientific Computing' },
    { name: 'C / C++', level: 'Advanced', category: 'Scientific Computing' },
    { name: 'React.js', level: 'Advanced', category: 'Web Development' },
    { name: 'Node.js', level: 'Advanced', category: 'Web Development' },
    { name: 'Express.js', level: 'Advanced', category: 'Web Development' },
    { name: 'HTML / CSS', level: 'Expert', category: 'Web Development' },
    { name: 'Tailwind CSS', level: 'Advanced', category: 'Web Development' },
    { name: 'Machine Learning', level: 'Intermediate', category: 'Artificial Intelligence' },
    { name: 'Neural Networks', level: 'Intermediate', category: 'Artificial Intelligence' },
    { name: 'Git & GitHub', level: 'Advanced', category: 'Tools' },
    { name: 'OOP', level: 'Advanced', category: 'Tools' },
  ],
  strengths: [
    { icon: '∂', title: 'Mathematical Modeling' },
    { icon: '∫', title: 'Numerical Analysis & Scientific Computing' },
    { icon: '</>', title: 'Web Development (MERN Stack)' },
    { icon: '🧩', title: 'Problem Solving' },
  ],
  deskItems: [
    { label: 'Reading',  value: 'Trefethen — Approximation Theory and Approximation Practice' },
    { label: 'Building', value: 'PDE solver with interactive web visualizations (FreeFEM + React)' },
    { label: 'Learning', value: 'Parallel computing & Fluid mechanics' },
    { label: 'Working',  value: "Master's Thesis on Nonsmooth Multiobjective Optimization" },
  ],
  talks: [],
};

exports.getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) about = await About.create(DEFAULTS);
    res.json(about);
  } catch (err) { next(err); }
};

exports.updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ ...DEFAULTS, ...req.body });
    } else {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true });
    }
    res.json(about);
  } catch (err) { next(err); }
};
