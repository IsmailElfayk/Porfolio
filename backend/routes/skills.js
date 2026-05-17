const router = require('express').Router();
const { getSkills, getSkill, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const auth = require('../middleware/authMiddleware');

router.get('/',     getSkills);
router.get('/:id',  getSkill);
router.post('/',    auth, createSkill);
router.put('/:id',  auth, updateSkill);
router.delete('/:id', auth, deleteSkill);

module.exports = router;
