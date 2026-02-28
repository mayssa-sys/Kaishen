const { Router } = require('express');
const idaktoController = require('../controllers/idaktoController');
const router = Router();
router.post('/verify', idaktoController.verifyIdentity);
router.get('/status/:verification_id', idaktoController.getStatus);
module.exports = router;
