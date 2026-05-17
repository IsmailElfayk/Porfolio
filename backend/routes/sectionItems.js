const router = require('express').Router();
const { getSectionItems, getSectionItem, createSectionItem, updateSectionItem, deleteSectionItem } = require('../controllers/sectionItemController');
const auth = require('../middleware/authMiddleware');

router.get('/',      getSectionItems);
router.get('/:id',   getSectionItem);
router.post('/',     auth, createSectionItem);
router.put('/:id',   auth, updateSectionItem);
router.delete('/:id', auth, deleteSectionItem);

module.exports = router;
