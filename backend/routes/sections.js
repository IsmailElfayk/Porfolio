const router = require('express').Router();
const { getSections, createSection, updateSection, deleteSection } = require('../controllers/sectionController');
const auth = require('../middleware/authMiddleware');

router.get('/',     getSections);
router.post('/',    auth, createSection);
router.put('/:id',  auth, updateSection);
router.delete('/:id', auth, deleteSection);

module.exports = router;
