const router = require('express').Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

router.get('/',     getProjects);
router.get('/:id',  getProject);
router.post('/',    auth, createProject);
router.put('/:id',  auth, updateProject);
router.delete('/:id', auth, deleteProject);

module.exports = router;
