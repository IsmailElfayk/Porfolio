const Project = require('../models/Project');

exports.getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured) filter.featured = req.query.featured === 'true';
    if (req.query.status) filter.status = req.query.status;
    const projects = await Project.find(filter).sort({ year: -1, createdAt: -1 });
    res.json(projects);
  } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { next(err); }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
