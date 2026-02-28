/**
 * Trust Engine v0.1 — MVP Mock
 *
 * In production this will combine:
 *   1. Credolab behavioral score (phone metadata)
 *   2. Income verification
 *   3. Merchant-vouching / social graph
 *   4. Transaction history
 *
 * For now: weighted random with slight bias from available inputs.
 */

const BANDS = {
  EXCELLENT: { min: 80, label: 'excellent', maxCredit: 5000 },
  GOOD:     { min: 60, label: 'good',      maxCredit: 2500 },
  FAIR:     { min: 40, label: 'fair',       maxCredit: 1000 },
  POOR:     { min: 20, label: 'poor',       maxCredit: 250  },
  REJECT:   { min: 0,  label: 'reject',     maxCredit: 0    },
};

function getBand(score) {
  if (score >= 80) return BANDS.EXCELLENT;
  if (score >= 60) return BANDS.GOOD;
  if (score >= 40) return BANDS.FAIR;
  if (score >= 20) return BANDS.POOR;
  return BANDS.REJECT;
}

/**
 * Calculate a mock Trust Score.
 *
 * @param {Object} data - User data payload
 * @returns {{ score: number, band: object, breakdown: object }}
 */
function calculate(data) {
  // Base random score (0-100)
  let base = Math.random() * 100;

  // Slight boosts for providing optional data (rewarding completeness)
  const completenessBonus =
    (data.monthly_income ? 5 : 0) +
    (data.employment_type ? 5 : 0) +
    (data.credolab_id ? 10 : 0);

  // Employment type heuristic (mock)
  const employmentBonus =
    data.employment_type === 'salaried' ? 8 :
    data.employment_type === 'self_employed' ? 3 :
    data.employment_type === 'freelance' ? 2 : 0;

  // Income heuristic (mock — assumes USD monthly)
  const incomeBonus = data.monthly_income
    ? Math.min(10, data.monthly_income / 500)
    : 0;

  const raw = base + completenessBonus + employmentBonus + incomeBonus;
  const score = Math.round(Math.min(100, Math.max(0, raw)));
  const band = getBand(score);

  return {
    score,
    band: {
      label: band.label,
      max_credit_usd: band.maxCredit,
    },
    breakdown: {
      base_score: Math.round(base),
      completeness_bonus: completenessBonus,
      employment_bonus: employmentBonus,
      income_bonus: Math.round(incomeBonus * 10) / 10,
      note: 'MVP mock — will be replaced with real scoring model',
    },
  };
}

module.exports = { calculate, getBand, BANDS };
