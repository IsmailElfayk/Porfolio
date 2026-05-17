const Section = require('../models/Section');

const DEFAULTS = [
  { name: 'Mathematics',                    intro: 'With a strong foundation in Applied Mathematics, I specialize in translating theoretical concepts into practical solutions.', visible: true, order: 0, slug: 'mathematics',   isDeletable: true  },
  { name: 'Programming & Machine Learning', intro: 'Leveraging the MERN stack, I develop robust web applications that integrate machine learning models and data-driven insights.',    visible: true, order: 1, slug: 'programming', isDeletable: true  },
  { name: 'Projects',                       intro: '',                                                                                                                               visible: true, order: 2, slug: 'projects',    isDeletable: false },
];

async function seedDefaults() {
  const count = await Section.countDocuments();
  if (count === 0) await Section.insertMany(DEFAULTS);
}

exports.getSections = async (req, res, next) => {
  try {
    await seedDefaults();
    const sections = await Section.find().sort({ order: 1, createdAt: 1 });
    res.json(sections);
  } catch (err) { next(err); }
};

exports.createSection = async (req, res, next) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (err) { next(err); }
};

exports.updateSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) { next(err); }
};

exports.deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ error: 'Not found' });
    if (!section.isDeletable) return res.status(400).json({ error: 'This section cannot be deleted.' });
    await Section.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
