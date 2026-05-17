const router = require('express').Router();
const { getPapers, getPaper, createPaper, updatePaper, deletePaper } = require('../controllers/paperController');
const auth = require('../middleware/authMiddleware');

router.get('/',     getPapers);
router.get('/:id',  getPaper);
router.post('/',    auth, createPaper);
router.put('/:id',  auth, updatePaper);
router.delete('/:id', auth, deletePaper);

module.exports = router;
