const merchantService = require('../services/merchantService');

exports.register = async (req, res, next) => {
  try {
    const { business_name, contact_name, phone, commission_rate } = req.body;
    if (!business_name || !contact_name || !phone) {
      return res.status(400).json({ error: 'Missing required fields: business_name, contact_name, phone' });
    }
    const result = await merchantService.register(req.body);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try { res.json(merchantService.getAll()); } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const merchant = merchantService.getById(req.params.id);
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
    res.json(merchant);
  } catch (err) { next(err); }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const merchant = merchantService.getById(req.params.id);
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
    const txService = require('../services/transactionService');
    const transactions = txService.getByMerchant(req.params.id);
    res.json({
      merchant,
      summary: {
        total_transactions: merchant.total_transactions,
        total_volume_usd: merchant.total_volume,
        total_commission: Math.round(merchant.total_volume * (merchant.commission_rate / 100) * 100) / 100,
        net_payout: Math.round(merchant.total_volume * (1 - merchant.commission_rate / 100) * 100) / 100
      },
      recent_transactions: transactions.slice(-10)
    });
  } catch (err) { next(err); }
};
