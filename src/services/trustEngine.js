/**
 * Kaishen Trust Engine v0.2 — Three-Tier Credit System
 *
 * TIER 1 — UNBANKED (no bank account)
 *   Requirements: Credolab score + Phone verification + ID verification + Employment details
 *   Starting limit: $200 USD
 *   Growth: Up to $1,000 USD based on repayment history
 *
 * TIER 2 — BANKED / PREMIUM EMPLOYEE
 *   Requirements: Tier 1 + (Top-tier employer OR linked debit card with sufficient funds)
 *   Starting limit: $500 USD
 *   Growth: Up to $2,000 USD
 *
 * TIER 3 — GOLD COLLATERAL
 *   Requirements: Gold deposited at Kaishen trusted partner
 *   Limit: Up to the valuation of deposited gold
 *   No ceiling — depends on collateral value
 */

// ── Tier Definitions ──────────────────────────────────────────────
const TIERS = {
  TIER_1: {
    id: 1,
    name: 'Starter',
    label: 'Unbanked Access',
    description: 'For users without a bank account — verified via Credolab, phone, ID, and employment',
    min_limit: 200,
    max_limit: 1000,
    starting_limit: 200,
    color: '#06D6F2',
    requirements: ['phone_verified', 'id_verified', 'credolab_scored', 'employment_provided'],
  },
  TIER_2: {
    id: 2,
    name: 'Premium',
    label: 'Banked / Premium Employee',
    description: 'For top-tier employees or users with a linked debit card',
    min_limit: 500,
    max_limit: 2000,
    starting_limit: 500,
    color: '#7C3AED',
    requirements: ['phone_verified', 'id_verified', 'credolab_scored', 'employment_provided', 'tier2_qualifier'],
  },
  TIER_3: {
    id: 3,
    name: 'Gold',
    label: 'Gold Collateral',
    description: 'Credit backed by gold deposited at a Kaishen trusted partner',
    min_limit: 0,
    max_limit: Infinity,
    starting_limit: 0,
    color: '#F5A623',
    requirements: ['phone_verified', 'id_verified', 'gold_collateral'],
  },
};

// ── Top-tier employers (mock list — would be configurable in production) ──
const TOP_TIER_EMPLOYERS = [
  'credit_libanais', 'blom_bank', 'byblos_bank', 'audi_bank',
  'azadea_group', 'abc_group', 'mea', 'ogero', 'touch', 'alfa',
  'deloitte', 'pwc', 'kpmg', 'ey', 'mckinsey',
  'aub', 'lau', 'usj', 'usek',
  'solidere', 'mikati_foundation',
];

// ── Gold price reference (mock — would come from API in production) ──
const GOLD_USD_PER_GRAM = 85; // approximate price per gram

// ── Repayment history multiplier ──
// Each on-time payment increases available limit within tier range
function calculateRepaymentBonus(completedPayments, onTimePayments) {
  if (completedPayments === 0) return 0;
  const onTimeRatio = onTimePayments / completedPayments;
  // Each completed payment adds ~5% growth, scaled by on-time ratio
  const growthFactor = Math.min(1, completedPayments * 0.05) * onTimeRatio;
  return growthFactor;
}

// ── Credolab Score Thresholds ──
function credolabPassesThreshold(normalizedScore) {
  // Credolab normalized 0-100; we require at least 30 to approve
  return normalizedScore >= 30;
}

// ── Tier Determination ──────────────────────────────────────────
/**
 * Determine which tier a user qualifies for and their credit limit.
 *
 * @param {Object} data
 * @param {boolean} data.phone_verified
 * @param {boolean} data.id_verified
 * @param {number}  data.credolab_score       — normalized 0-100
 * @param {string}  data.employment_type      — salaried | self_employed | freelance
 * @param {string}  data.employer_id          — employer identifier (lowercase, underscored)
 * @param {number}  data.employer_tier        — 1 (top) or 2 (second tier) or null
 * @param {boolean} data.debit_card_linked    — whether they linked a debit card
 * @param {number}  data.debit_card_balance   — balance on linked card (USD)
 * @param {number}  data.gold_grams           — grams of gold deposited as collateral
 * @param {string}  data.gold_partner         — trusted partner name
 * @param {number}  data.completed_payments   — historical completed payments
 * @param {number}  data.on_time_payments     — historical on-time payments
 * @param {number}  data.monthly_income       — declared monthly income (USD)
 *
 * @returns {Object} { approved, tier, credit_limit, checks, breakdown }
 */
function evaluate(data) {
  const checks = {
    phone_verified: !!data.phone_verified,
    id_verified: !!data.id_verified,
    credolab_scored: data.credolab_score != null && credolabPassesThreshold(data.credolab_score),
    employment_provided: !!data.employment_type,
    top_tier_employer: !!(data.employer_tier && data.employer_tier <= 2) || TOP_TIER_EMPLOYERS.includes((data.employer_id || '').toLowerCase()),
    debit_card_linked: !!data.debit_card_linked && (data.debit_card_balance || 0) > 0,
    gold_collateral: (data.gold_grams || 0) > 0 && !!data.gold_partner,
  };

  // Derived qualifier for Tier 2
  checks.tier2_qualifier = checks.top_tier_employer || checks.debit_card_linked;

  const repaymentBonus = calculateRepaymentBonus(
    data.completed_payments || 0,
    data.on_time_payments || 0
  );

  // ── Check Tier 3 first (gold collateral) ──
  if (checks.phone_verified && checks.id_verified && checks.gold_collateral) {
    const goldValue = Math.round((data.gold_grams || 0) * GOLD_USD_PER_GRAM);
    return {
      approved: true,
      tier: TIERS.TIER_3,
      credit_limit: goldValue,
      checks,
      breakdown: {
        tier_reason: 'Gold collateral deposited at ' + data.gold_partner,
        gold_grams: data.gold_grams,
        gold_price_per_gram: GOLD_USD_PER_GRAM,
        gold_valuation_usd: goldValue,
        credit_limit: goldValue,
        note: 'Credit limit equals gold collateral valuation',
      },
    };
  }

  // ── Check Tier 2 (banked / premium employee) ──
  if (checks.phone_verified && checks.id_verified && checks.credolab_scored && checks.employment_provided && checks.tier2_qualifier) {
    const tier = TIERS.TIER_2;
    const range = tier.max_limit - tier.starting_limit;
    const limit = Math.round(tier.starting_limit + (range * repaymentBonus));
    const qualifierReason = checks.top_tier_employer
      ? 'Top-tier employer: ' + (data.employer_id || 'verified')
      : 'Linked debit card with $' + (data.debit_card_balance || 0) + ' balance';

    return {
      approved: true,
      tier,
      credit_limit: Math.min(tier.max_limit, Math.max(tier.starting_limit, limit)),
      checks,
      breakdown: {
        tier_reason: qualifierReason,
        credolab_score: data.credolab_score,
        employment_type: data.employment_type,
        repayment_bonus: Math.round(repaymentBonus * 100) + '%',
        completed_payments: data.completed_payments || 0,
        on_time_payments: data.on_time_payments || 0,
        starting_limit: tier.starting_limit,
        max_limit: tier.max_limit,
        note: 'Limit grows with on-time repayment history',
      },
    };
  }

  // ── Check Tier 1 (unbanked) ──
  if (checks.phone_verified && checks.id_verified && checks.credolab_scored && checks.employment_provided) {
    const tier = TIERS.TIER_1;
    const range = tier.max_limit - tier.starting_limit;
    const limit = Math.round(tier.starting_limit + (range * repaymentBonus));

    return {
      approved: true,
      tier,
      credit_limit: Math.min(tier.max_limit, Math.max(tier.starting_limit, limit)),
      checks,
      breakdown: {
        tier_reason: 'Unbanked access — verified via Credolab + ID + employment',
        credolab_score: data.credolab_score,
        employment_type: data.employment_type,
        monthly_income: data.monthly_income || 'not disclosed',
        repayment_bonus: Math.round(repaymentBonus * 100) + '%',
        completed_payments: data.completed_payments || 0,
        on_time_payments: data.on_time_payments || 0,
        starting_limit: tier.starting_limit,
        max_limit: tier.max_limit,
        note: 'Limit grows with on-time repayment history (up to $1,000)',
      },
    };
  }

  // ── Not approved — missing requirements ──
  const missing = [];
  if (!checks.phone_verified) missing.push('Phone verification');
  if (!checks.id_verified) missing.push('ID verification (eKYC)');
  if (!checks.credolab_scored) missing.push('Credolab behavioral score (min 30/100)');
  if (!checks.employment_provided) missing.push('Employment details');

  return {
    approved: false,
    tier: null,
    credit_limit: 0,
    checks,
    breakdown: {
      tier_reason: 'Not eligible — missing requirements',
      missing_requirements: missing,
      credolab_score: data.credolab_score || null,
      note: 'Complete all verifications to qualify for Tier 1 ($200 starting limit)',
    },
  };
}

// ── Legacy compatibility: simple score (for display) ──
function calculateDisplayScore(data) {
  let score = 0;
  if (data.phone_verified) score += 15;
  if (data.id_verified) score += 20;
  if (data.credolab_score) score += Math.round(data.credolab_score * 0.3);
  if (data.employment_type === 'salaried') score += 15;
  else if (data.employment_type === 'self_employed') score += 10;
  else if (data.employment_type === 'freelance') score += 7;
  if (data.monthly_income) score += Math.min(10, Math.round(data.monthly_income / 200));
  if (data.debit_card_linked) score += 5;
  if (data.gold_grams > 0) score += 5;
  return Math.min(100, Math.max(0, score));
}

module.exports = { evaluate, calculateDisplayScore, TIERS, TOP_TIER_EMPLOYERS, GOLD_USD_PER_GRAM };