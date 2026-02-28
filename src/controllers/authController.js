const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { phone, full_name } = req.body;
    if (!phone || !full_name) return res.status(400).json({ error: 'Missing required fields: phone, full_name' });
    const result = await authService.register(phone, full_name);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) { next(err); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Missing required fields: phone, otp' });
    const result = await authService.verifyOTP(phone, otp);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Missing required field: phone' });
    const result = await authService.login(phone);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) { next(err); }
};

exports.verifyLogin = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Missing required fields: phone, otp' });
    const result = await authService.verifyLogin(phone, otp);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Missing authorization token' });
    const user = authService.getUserByToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    res.json(user);
  } catch (err) { next(err); }
};
