#!/bin/bash
# Kaishen MVP Backend - Run this inside the Kaishen folder
mkdir -p src/routes src/controllers src/services src/models src/middlewares src/config src/utils tests

cat > '.gitignore' << 'XEOF'
node_modules/
.env
dist/
coverage/
*.log
.DS_Store
XEOF

cat > '.env.example' << 'XEOF'
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://kaishen:password@localhost:5432/kaishen_mvp
CREDOLAB_API_URL=https://api.credolab.com/v1
CREDOLAB_API_KEY=your_api_key_here
TRUST_SCORE_MIN=0
TRUST_SCORE_MAX=100
XEOF

cat > '.dockerignore' << 'XEOF'
.git
node_modules
.env
coverage
tests
*.md
.DS_Store
XEOF

cat > 'Dockerfile' << 'XEOF'
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/index.js"]
XEOF

cat > 'Procfile' << 'XEOF'
web: node src/index.js
XEOF

cat > 'railway.json' << 'XEOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "DOCKERFILE", "dockerfilePath": "Dockerfile" },
  "deploy": {
    "startCommand": "node src/index.js",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 10,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
XEOF

cat > 'railway.toml' << 'XEOF'
engine:
  name: kaishen-mvp-backend
  env:
    PORT: 3000
    NODE_ENV: production
XEOF

cat > 'package.json' << 'XEOF'
{
  "name": "kaishen-mvp-backend",
  "version": "0.1.0",
  "description": "BNPL Trust Engine backend for the Lebanese market",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --verbose"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "pg": "^8.12.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
XEOF

cat > 'src/index.js' << 'XEOF'
const app = require('./app');
const config = require('./config');
app.listen(config.port, () => {
  console.log(`[kaishen] Server running on port ${config.port} (${config.nodeEnv})`);
});
XEOF

cat > 'src/app.js' << 'XEOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const scoreRoutes = require('./routes/score');
const credolabRoutes = require('./routes/credolab');
const healthRoutes = require('./routes/health');
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/score', scoreRoutes);
app.use('/api/v1/credolab', credolabRoutes);
app.use((req, res) => { res.status(404).json({ error: 'Not found' }); });
app.use((err, req, res, _next) => {
  console.error('[kaishen] Error:', err.message);
  res.status(err.status || 500).json({
    error: req.app.get('env') === 'development' ? err.message : 'Internal server error',
  });
});
module.exports = app;
XEOF

cat > 'src/config/index.js' << 'XEOF'
require('dotenv').config();
module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: { connectionString: process.env.DATABASE_URL || 'postgresql://kaishen:password@localhost:5432/kaishen_mvp' },
  credolab: { apiUrl: process.env.CREDOLAB_API_URL || 'https://api.credolab.com/v1', apiKey: process.env.CREDOLAB_API_KEY || '' },
  trustScore: { min: parseInt(process.env.TRUST_SCORE_MIN, 10) || 0, max: parseInt(process.env.TRUST_SCORE_MAX, 10) || 100 },
};
XEOF

cat > 'src/routes/health.js' << 'XEOF'
const { Router } = require('express');
const router = Router();
router.get('/', (_req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString() }); });
module.exports = router;
XEOF

cat > 'src/routes/score.js' << 'XEOF'
const { Router } = require('express');
const scoreController = require('../controllers/scoreController');
const router = Router();
router.post('/', scoreController.calculateScore);
module.exports = router;
XEOF

cat > 'src/routes/credolab.js' << 'XEOF'
const { Router } = require('express');
const credolabController = require('../controllers/credolabController');
const router = Router();
router.post('/score', credolabController.fetchAndStoreScore);
module.exports = router;
XEOF

cat > 'src/controllers/scoreController.js' << 'XEOF'
const trustEngine = require('../services/trustEngine');
exports.calculateScore = async (req, res, next) => {
  try {
    const { user_id, full_name, phone } = req.body;
    if (!user_id || !full_name || !phone) {
      return res.status(400).json({ error: 'Missing required fields: user_id, full_name, phone' });
    }
    const result = trustEngine.calculate(req.body);
    res.json({ user_id, trust_score: result.score, band: result.band, breakdown: result.breakdown, calculated_at: new Date().toISOString() });
  } catch (err) { next(err); }
};
XEOF

cat > 'src/controllers/credolabController.js' << 'XEOF'
const credolabService = require('../services/credolabService');
exports.fetchAndStoreScore = async (req, res, next) => {
  try {
    const { user_id, credolab_id } = req.body;
    if (!user_id || !credolab_id) {
      return res.status(400).json({ error: 'Missing required fields: user_id, credolab_id' });
    }
    const result = await credolabService.fetchAndStore(user_id, credolab_id);
    res.json({ user_id, credolab_id, behavioral_score: result.score, risk_category: result.riskCategory, stored: result.stored, fetched_at: result.fetchedAt });
  } catch (err) { next(err); }
};
XEOF

cat > 'src/services/trustEngine.js' << 'XEOF'
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
function calculate(data) {
  let base = Math.random() * 100;
  const completenessBonus = (data.monthly_income ? 5 : 0) + (data.employment_type ? 5 : 0) + (data.credolab_id ? 10 : 0);
  const employmentBonus = data.employment_type === 'salaried' ? 8 : data.employment_type === 'self_employed' ? 3 : data.employment_type === 'freelance' ? 2 : 0;
  const incomeBonus = data.monthly_income ? Math.min(10, data.monthly_income / 500) : 0;
  const raw = base + completenessBonus + employmentBonus + incomeBonus;
  const score = Math.round(Math.min(100, Math.max(0, raw)));
  const band = getBand(score);
  return {
    score,
    band: { label: band.label, max_credit_usd: band.maxCredit },
    breakdown: { base_score: Math.round(base), completeness_bonus: completenessBonus, employment_bonus: employmentBonus, income_bonus: Math.round(incomeBonus * 10) / 10, note: 'MVP mock — will be replaced with real scoring model' },
  };
}
module.exports = { calculate, getBand, BANDS };
XEOF

cat > 'src/services/credolabService.js' << 'XEOF'
const config = require('../config');
const db = require('../models/db');
async function fetchBehavioralScore(credolabId) {
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));
  const rawScore = Math.round(Math.random() * 1000);
  let riskCategory;
  if (rawScore >= 750) riskCategory = 'low_risk';
  else if (rawScore >= 500) riskCategory = 'medium_risk';
  else if (rawScore >= 250) riskCategory = 'high_risk';
  else riskCategory = 'very_high_risk';
  return { credolabId, rawScore, normalizedScore: Math.round((rawScore / 1000) * 100), riskCategory, modules: { device_integrity: Math.round(Math.random() * 100), app_usage_pattern: Math.round(Math.random() * 100), financial_behavior: Math.round(Math.random() * 100) } };
}
async function fetchAndStore(userId, credolabId) {
  const result = await fetchBehavioralScore(credolabId);
  const fetchedAt = new Date().toISOString();
  let stored = false;
  try {
    await db.query(`INSERT INTO credolab_scores (user_id, credolab_id, raw_score, normalized_score, risk_category, modules, fetched_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id, credolab_id) DO UPDATE SET raw_score = EXCLUDED.raw_score, normalized_score = EXCLUDED.normalized_score, risk_category = EXCLUDED.risk_category, modules = EXCLUDED.modules, fetched_at = EXCLUDED.fetched_at`, [userId, credolabId, result.rawScore, result.normalizedScore, result.riskCategory, JSON.stringify(result.modules), fetchedAt]);
    stored = true;
  } catch (err) { console.warn('[credolab] DB store failed (expected in dev without DB):', err.message); stored = false; }
  return { score: result.normalizedScore, riskCategory: result.riskCategory, modules: result.modules, stored, fetchedAt };
}
module.exports = { fetchAndStore, fetchBehavioralScore };
XEOF

cat > 'src/models/db.js' << 'XEOF'
const { Pool } = require('pg');
const config = require('../config');
const pool = new Pool({ connectionString: config.db.connectionString });
pool.on('error', (err) => { console.warn('[db] Pool error (non-fatal in dev):', err.message); });
module.exports = { query: (text, params) => pool.query(text, params), pool };
XEOF

cat > 'src/models/schema.sql' << 'XEOF'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), full_name VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL UNIQUE, email VARCHAR(255), monthly_income NUMERIC(12,2), employment_type VARCHAR(50), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trust_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES users(id), score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100), band VARCHAR(20) NOT NULL, breakdown JSONB, calculated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS credolab_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES users(id), credolab_id VARCHAR(255) NOT NULL, raw_score INTEGER, normalized_score INTEGER CHECK (normalized_score >= 0 AND normalized_score <= 100), risk_category VARCHAR(50), modules JSONB, fetched_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(user_id, credolab_id)
);
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES users(id), merchant_id UUID, amount_usd NUMERIC(12,2) NOT NULL, installments INTEGER NOT NULL DEFAULT 4, status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW()
);
XEOF

cat > 'src/middlewares/validate.js' << 'XEOF'
function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => !req.body[f]);
    if (missing.length > 0) return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    next();
  };
}
module.exports = { requireFields };
XEOF

cat > 'src/utils/logger.js' << 'XEOF'
const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = process.env.LOG_LEVEL || 'info';
function log(level, message, meta = {}) {
  if (levels[level] > levels[currentLevel]) return;
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...meta }));
}
module.exports = { error: (msg, meta) => log('error', msg, meta), warn: (msg, meta) => log('warn', msg, meta), info: (msg, meta) => log('info', msg, meta), debug: (msg, meta) => log('debug', msg, meta) };
XEOF

cat > 'tests/score.test.js' << 'XEOF'
const request = require('supertest');
const app = require('../src/app');
describe('POST /api/v1/score', () => {
  it('returns a trust score for valid input', async () => {
    const res = await request(app).post('/api/v1/score').send({ user_id: 'test-user-001', full_name: 'Ahmad Khalil', phone: '+9611234567', monthly_income: 1200, employment_type: 'salaried' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('trust_score');
    expect(res.body.trust_score).toBeGreaterThanOrEqual(0);
    expect(res.body.trust_score).toBeLessThanOrEqual(100);
  });
  it('rejects requests missing required fields', async () => {
    const res = await request(app).post('/api/v1/score').send({ user_id: 'test-user-001' });
    expect(res.status).toBe(400);
  });
  it('returns score between 0-100 even with minimal data', async () => {
    const res = await request(app).post('/api/v1/score').send({ user_id: 'test-user-002', full_name: 'Sara Nassar', phone: '+9619876543' });
    expect(res.status).toBe(200);
    expect(res.body.trust_score).toBeGreaterThanOrEqual(0);
    expect(res.body.trust_score).toBeLessThanOrEqual(100);
  });
});
describe('GET /api/v1/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
XEOF

echo ""
echo "=== ALL FILES CREATED ==="
echo "Now run these 3 commands:"
echo "  git add -A"
echo '  git commit -m "Initial MVP: Trust Engine + Credolab + REST API"'
echo "  git push -u origin main"
