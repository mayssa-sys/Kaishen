const { Router } = require('express');
const scoreController = require('../controllers/scoreController');

const router = Router();

// POST /api/v1/score
// Accepts user data, returns a Trust Score (0-100)
router.post('/', scoreController.calculateScore);

module.exports = router;
