const { Router } = require('express');
const scoreController = require('../controllers/scoreController');

const router = Router();

// POST /api/v1/score — legacy simple scoring (demo flow)
router.post('/', scoreController.calculateScore);

// POST /api/v1/score/evaluate — full tier evaluation
router.post('/evaluate', scoreController.evaluate);

// GET /api/v1/score/tiers — list all tier definitions
router.get('/tiers', scoreController.getTiers);

module.exports = router;
