const router = require('express').Router();
const { submitContact, getMessages, deleteMessage } = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', auth, getMessages);
router.delete('/:id', auth, deleteMessage);

module.exports = router;
