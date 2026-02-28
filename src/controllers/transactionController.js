const transactionService = require('../services/transactionService');

exports.initiate = async (req, res, next) => {
  try {
    const { user_id, merchant_id, amount } = req.body;
    if (!user_id || !merchant_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields: user_id, merchant_id, amount' });
    }
    if (amount <= 0) return res.status(400).json({ error: 'Amount must be greater than 0' });
    const result = await transactionService.initiate(user_id, merchant_id, parseFloat(amount));
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getByUser = async (req, res, next) => {
  try { res.json(transactionService.getByUser(req.params.user_id)); } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const tx = transactionService.getById(req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    res.json(tx);
  } catch (err) { next(err); }
};

exports.makePayment = async (req, res, next) => {
  try {
    const { payment_id } = req.body;
    if (!payment_id) return res.status(400).json({ error: 'Missing required field: payment_id' });
    const result = transactionService.makePayment(payment_id);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getUpcoming = async (req, res, next) => {
  try { res.json(transactionService.getUpcomingPayments(req.params.user_id)); } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try { res.json(transactionService.getAll()); } catch (err) { next(err); }
};
