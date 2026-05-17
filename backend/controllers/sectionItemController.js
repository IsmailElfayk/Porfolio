const SectionItem = require('../models/SectionItem');

exports.getSectionItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.section) filter.section = req.query.section;
    const items = await SectionItem.find(filter).populate('section', 'name').sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) { next(err); }
};

exports.getSectionItem = async (req, res, next) => {
  try {
    const item = await SectionItem.findById(req.params.id).populate('section', 'name');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.createSectionItem = async (req, res, next) => {
  try {
    const item = await SectionItem.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateSectionItem = async (req, res, next) => {
  try {
    const item = await SectionItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.deleteSectionItem = async (req, res, next) => {
  try {
    const item = await SectionItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
