const trustEngine = require('../services/trustEngine');
const credolabService = require('../services/credolabService');
const authService = require('../services/authService');

/**
 * POST /api/v1/score/evaluate
 *
 * Main credit evaluation endpoint — determines tier + credit limit.
 *
 * Body: {
 *   user_id: string,
 *   full_name: string,
 *   phone: string,
 *   employment_type?: 'salaried' | 'self_employed' | 'freelance',
 *   employer_id?: string,
 *   monthly_income?: number,
 *   debit_card_linked?: boolean,
 *   debit_card_balance?: number,
 *   gold_grams?: number,
 *   gold_partner?: string,
 *   credolab_id?: string
 * }
 */
exports.evaluate = async (req, res, next) => {
  try {
    const { user_id, full_name, phone } = req.body;
    if (!user_id || !full_name || !phone) {
      return res.status(400).json({ error: 'Missing required fields: user_id, full_name, phone' });
    }

    // Get user record
    const user = authService.getUserById(user_id);

    // Fetch Credolab score if credolab_id provided
    let credolabScore = null;
    if (req.body.credolab_id) {
      const credoResult = await credolabService.fetchBehavioralScore(req.body.credolab_id);
      credolabScore = credoResult.normalizedScore;
    }

    // Build evaluation data
    const evalData = {
      phone_verified: user ? user.phone_verified !== false : true, // phone verified via OTP
      id_verified: user ? user.kyc_status === 'verified' : false,
      credolab_score: credolabScore,
      employment_type: req.body.employment_type || null,
      employer_id: req.body.employer_id || null,
      employer_tier: req.body.employer_tier || null,
      monthly_income: req.body.monthly_income || 0,
      debit_card_linked: req.body.debit_card_linked || false,
      debit_card_balance: req.body.debit_card_balance || 0,
      gold_grams: req.body.gold_grams || 0,
      gold_partner: req.body.gold_partner || null,
      completed_payments: user ? (user.completed_payments || 0) : 0,
      on_time_payments: user ? (user.on_time_payments || 0) : 0,
    };

    const result = trustEngine.evaluate(evalData);
    const displayScore = trustEngine.calculateDisplayScore(evalData);

    // Update user record with tier info
    if (user) {
      authService.updateUser(user_id, {
        trust_score: displayScore,
        credit_limit: result.credit_limit,
        credit_tier: result.tier ? result.tier.id : null,
        credit_tier_name: result.tier ? result.tier.name : null,
        credolab_score: credolabScore,
        last_evaluation: new Date().toISOString(),
      });
    }

    res.json({
      user_id,
      approved: result.approved,
      display_score: displayScore,
      tier: result.tier ? {
        id: result.tier.id,
        name: result.tier.name,
        label: result.tier.label,
        description: result.tier.description,
        color: result.tier.color,
        limit_range: result.tier.id === 3
          ? 'Up to gold valuation'
          : '$' + result.tier.min_limit + ' – $' + result.tier.max_limit,
      } : null,
      credit_limit: result.credit_limit,
      checks: result.checks,
      breakdown: result.breakdown,
      evaluated_at: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/score/tiers
 * Returns all tier definitions for the frontend.
 */
exports.getTiers = (req, res) => {
  const tiers = Object.values(trustEngine.TIERS).map(t => ({
    id: t.id,
    name: t.name,
    label: t.label,
    description: t.description,
    min_limit: t.min_limit,
    max_limit: t.max_limit === Infinity ? null : t.max_limit,
    starting_limit: t.starting_limit,
    color: t.color,
    requirements: t.requirements,
  }));
  res.json(tiers);
};

/**
 * POST /api/v1/score (legacy — kept for backward compatibility)
 * Simplified scoring for quick demo.
 */
exports.calculateScore = async (req, res, next) => {
  try {
    const { user_id, full_name, phone } = req.body;
    if (!user_id || !full_name || !phone) {
      return res.status(400).json({ error: 'Missing required fields: user_id, full_name, phone' });
    }

    // Fetch credolab score
    let credolabScore = null;
    if (req.body.credolab_id) {
      const credoResult = await credolabService.fetchBehavioralScore(req.body.credolab_id);
      credolabScore = credoResult.normalizedScore;
    }

    const user = authService.getUserById(user_id);

    const evalData = {
      phone_verified: true,
      id_verified: user ? user.kyc_status === 'verified' : true,
      credolab_score: credolabScore || Math.round(40 + Math.random() * 50), // fallback mock
      employment_type: req.body.employment_type || null,
      employer_id: req.body.employer_id || null,
      monthly_income: req.body.monthly_income || 0,
      debit_card_linked: req.body.debit_card_linked || false,
      debit_card_balance: req.body.debit_card_balance || 0,
      gold_grams: req.body.gold_grams || 0,
      gold_partner: req.body.gold_partner || null,
      completed_payments: user ? (user.completed_payments || 0) : 0,
      on_time_payments: user ? (user.on_time_payments || 0) : 0,
    };

    const result = trustEngine.evaluate(evalData);
    const displayScore = trustEngine.calculateDisplayScore(evalData);

    if (user) {
      authService.updateUser(user_id, {
        trust_score: displayScore,
        credit_limit: result.credit_limit,
        credit_tier: result.tier ? result.tier.id : null,
      });
    }

    // Return in legacy format for backward compat with demo flow
    res.json({
      user_id,
      trust_score: displayScore,
      band: {
        label: result.tier ? result.tier.name.toLowerCase() : 'reject',
        max_credit_usd: result.credit_limit,
      },
      tier: result.tier ? {
        id: result.tier.id,
        name: result.tier.name,
        label: result.tier.label,
        color: result.tier.color,
      } : null,
      approved: result.approved,
      credit_limit: result.credit_limit,
      checks: result.checks,
      breakdown: result.breakdown,
      calculated_at: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};
