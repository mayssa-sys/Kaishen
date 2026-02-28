const { Router } = require('express');
const merchantController = require('../controllers/merchantController');
const router = Router();
router.post('/register', merchantController.register);
router.get('/', merchantController.getAll);
router.get('/:id', merchantController.getById);
router.get('/:id/dashboard', merchantController.getDashboard);
module.exports = router;
