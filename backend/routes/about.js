const router = require('express').Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const auth = require('../middleware/authMiddleware');

router.get('/', getAbout);
router.put('/', auth, updateAbout);

module.exports = router;
