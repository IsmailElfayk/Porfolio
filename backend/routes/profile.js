const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

router.get('/', getProfile);
router.put('/', auth, updateProfile);

module.exports = router;
