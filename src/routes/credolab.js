const { Router } = require('express');
const credolabController = require('../controllers/credolabController');

const router = Router();

// POST /api/v1/credolab/score
// Receives credolab_id from mobile app, fetches behavioral score, stores it
router.post('/score', credolabController.fetchAndStoreScore);

module.exports = router;
