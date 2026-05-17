const Paper = require('../models/Paper');

exports.getPapers = async (req, res, next) => {
  try {
    const papers = await Paper.find().sort({ year: -1 });
    res.json(papers);
  } catch (err) { next(err); }
};

exports.getPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Not found' });
    res.json(paper);
  } catch (err) { next(err); }
};

exports.createPaper = async (req, res, next) => {
  try {
    const paper = await Paper.create(req.body);
    res.status(201).json(paper);
  } catch (err) { next(err); }
};

exports.updatePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!paper) return res.status(404).json({ error: 'Not found' });
    res.json(paper);
  } catch (err) { next(err); }
};

exports.deletePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
