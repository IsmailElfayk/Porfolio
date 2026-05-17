const Theme = require('../models/Theme');

exports.getAllThemes = async (req, res, next) => {
  try {
    const themes = await Theme.find().sort({ order: 1, createdAt: 1 });
    res.json(themes);
  } catch (err) { next(err); }
};

exports.getThemeBySlug = async (req, res, next) => {
  try {
    const theme = await Theme.findOne({ slug: req.params.slug });
    if (!theme) return res.status(404).json({ error: 'Not found' });
    res.json(theme);
  } catch (err) { next(err); }
};

exports.createTheme = async (req, res, next) => {
  try {
    const theme = await Theme.create(req.body);
    res.status(201).json(theme);
  } catch (err) { next(err); }
};

exports.updateTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!theme) return res.status(404).json({ error: 'Not found' });
    res.json(theme);
  } catch (err) { next(err); }
};

exports.deleteTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
