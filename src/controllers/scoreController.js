const trustEngine = require('../services/trustEngine');

/**
 * POST /api/v1/score
 *
 * Body: {
 *   user_id: string,
 *   full_name: string,
 *   phone: string,          // Lebanese phone number
 *   monthly_income?: number, // in LBP or USD
 *   employment_type?: string,
 *   credolab_id?: string
 * }
 *
 * Returns: { score, band, breakdown }
 */
exports.calculateScore = async (req, res, next) => {
  try {
    const { user_id, full_name, phone } = req.body;

    if (!user_id || !full_name || !phone) {
      return res.status(400).json({
        error: 'Missing required fields: user_id, full_name, phone',
      });
    }

    const result = trustEngine.calculate(req.body);

    res.json({
      user_id,
      trust_score: result.score,
      band: result.band,
      breakdown: result.breakdown,
      calculated_at: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};
