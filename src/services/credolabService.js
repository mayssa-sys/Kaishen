/**
 * Credolab Integration Service — Mock
 *
 * In production:
 *   1. Mobile app integrates Credolab SDK → collects device metadata
 *   2. SDK returns a credolab_id (reference hash)
 *   3. Backend sends credolab_id to Credolab API → receives behavioral score
 *   4. Score is stored in our DB against the user
 *
 * For MVP: mocks the Credolab API call and returns synthetic data.
 */

const config = require('../config');
const db = require('../models/db');

/**
 * Mock Credolab API call.
 * In production: POST to config.credolab.apiUrl with the credolab_id.
 */
async function fetchBehavioralScore(credolabId) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

  // Mock score: 0-1000 range (Credolab's typical output)
  const rawScore = Math.round(Math.random() * 1000);

  // Map to risk categories (Credolab style)
  let riskCategory;
  if (rawScore >= 750) riskCategory = 'low_risk';
  else if (rawScore >= 500) riskCategory = 'medium_risk';
  else if (rawScore >= 250) riskCategory = 'high_risk';
  else riskCategory = 'very_high_risk';

  return {
    credolabId,
    rawScore,
    normalizedScore: Math.round((rawScore / 1000) * 100), // 0-100
    riskCategory,
    modules: {
      device_integrity: Math.round(Math.random() * 100),
      app_usage_pattern: Math.round(Math.random() * 100),
      financial_behavior: Math.round(Math.random() * 100),
    },
  };
}

/**
 * Fetch score from Credolab and persist to DB.
 */
async function fetchAndStore(userId, credolabId) {
  const result = await fetchBehavioralScore(credolabId);
  const fetchedAt = new Date().toISOString();

  // Store in DB (mock — logs to console if no DB connection)
  let stored = false;
  try {
    await db.query(
      `INSERT INTO credolab_scores (user_id, credolab_id, raw_score, normalized_score, risk_category, modules, fetched_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, credolab_id) DO UPDATE SET
         raw_score = EXCLUDED.raw_score,
         normalized_score = EXCLUDED.normalized_score,
         risk_category = EXCLUDED.risk_category,
         modules = EXCLUDED.modules,
         fetched_at = EXCLUDED.fetched_at`,
      [userId, credolabId, result.rawScore, result.normalizedScore, result.riskCategory, JSON.stringify(result.modules), fetchedAt]
    );
    stored = true;
  } catch (err) {
    console.warn('[credolab] DB store failed (expected in dev without DB):', err.message);
    stored = false;
  }

  return {
    score: result.normalizedScore,
    riskCategory: result.riskCategory,
    modules: result.modules,
    stored,
    fetchedAt,
  };
}

module.exports = { fetchAndStore, fetchBehavioralScore };
