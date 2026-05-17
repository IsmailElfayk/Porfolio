const Contact = require('../models/Contact');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    const doc = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, id: doc._id });
  } catch (err) { next(err); }
};

exports.getMessages = async (req, res, next) => {
  try {
    const msgs = await Contact.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { next(err); }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
