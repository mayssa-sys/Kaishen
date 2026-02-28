const credolabService = require('../services/credolabService');

/**
 * POST /api/v1/credolab/score
 *
 * Body: {
 *   user_id: string,
 *   credolab_id: string  // from Credolab SDK on mobile
 * }
 *
 * Fetches behavioral score from Credolab, stores in DB, returns result.
 */
exports.fetchAndStoreScore = async (req, res, next) => {
  try {
    const { user_id, credolab_id } = req.body;

    if (!user_id || !credolab_id) {
      return res.status(400).json({
        error: 'Missing required fields: user_id, credolab_id',
      });
    }

    const result = await credolabService.fetchAndStore(user_id, credolab_id);

    res.json({
      user_id,
      credolab_id,
      behavioral_score: result.score,
      risk_category: result.riskCategory,
      stored: result.stored,
      fetched_at: result.fetchedAt,
    });
  } catch (err) {
    next(err);
  }
};
