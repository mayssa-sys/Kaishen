const { Router } = require('express');
const authController = require('../controllers/authController');
const router = Router();
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/verify-login', authController.verifyLogin);
router.get('/profile', authController.getProfile);
module.exports = router;
