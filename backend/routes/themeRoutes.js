const router = require('express').Router();
const { getAllThemes, getThemeBySlug, createTheme, updateTheme, deleteTheme } = require('../controllers/themeController');
const auth = require('../middleware/authMiddleware');

router.get('/',       getAllThemes);
router.get('/:slug',  getThemeBySlug);
router.post('/',      auth, createTheme);
router.put('/:id',    auth, updateTheme);
router.delete('/:id', auth, deleteTheme);

module.exports = router;
