# Kaishen MVP — BNPL Backend

**Buy Now, Pay Later for the Lebanese market.**

A trust-based BNPL system that uses behavioral scoring (Credolab), income verification, and merchant vouching to extend micro-credit to underbanked consumers — without requiring traditional credit bureau data.

## Architecture

```
┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐
│  Flutter App  │────▶│   Express REST API   │────▶│  PostgreSQL  │
│  (Consumer)   │     │                     │     │              │
└──────────────┘     │  /api/v1/score      │     │  users       │
                     │  /api/v1/credolab   │     │  trust_scores│
┌──────────────┐     │  /api/v1/health     │     │  credolab_   │
│  Flutter App  │────▶│                     │     │    scores    │
│  (Merchant)   │     └────────┬────────────┘     │  transactions│
└──────────────┘              │                   └──────────────┘
                              │
                     ┌────────▼────────────┐
                     │   Trust Engine       │
                     │                     │
                     │  • Credolab SDK      │
                     │  • Income heuristics │
                     │  • Completeness bias │
                     │  • Merchant vouching │
                     └─────────────────────┘
```

## Trust Engine (v0.1 — Mock)

The scoring system currently uses a weighted random model with bonuses for data completeness. Production will integrate:

| Signal | Source | Weight (planned) |
|--------|--------|-------------------|
| Behavioral score | Credolab SDK (phone metadata) | 40% |
| Income verification | Bank statements / payslips | 25% |
| Data completeness | Profile fields filled | 10% |
| Employment type | Self-reported + verified | 10% |
| Merchant vouching | Social graph / repeat business | 15% |

### Score Bands

| Band | Score Range | Max Credit (USD) |
|------|-------------|-------------------|
| Excellent | 80-100 | $5,000 |
| Good | 60-79 | $2,500 |
| Fair | 40-59 | $1,000 |
| Poor | 20-39 | $250 |
| Reject | 0-19 | $0 |

## Folder Structure

```
kaishen-mvp-backend/
├── src/
│   ├── config/          # Environment and app configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/      # Validation, auth, error handling
│   ├── models/          # DB connection + SQL schema
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic (Trust Engine, Credolab)
│   ├── utils/           # Logger, helpers
│   ├── app.js           # Express app setup
│   └── index.js         # Server entry point
├── tests/               # Jest + Supertest
├── .env.example         # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Quick Start

```bash
# 1. Clone and install
cd kaishen-mvp-backend
cp .env.example .env
npm install

# 2. Set up PostgreSQL (optional for mock mode)
psql $DATABASE_URL -f src/models/schema.sql

# 3. Run
npm run dev    # with nodemon
npm start      # production

# 4. Test
npm test
```

## API Endpoints

### `GET /api/v1/health`

Health check.

### `POST /api/v1/score`

Calculate a Trust Score.

```json
// Request
{
  "user_id": "uuid-here",
  "full_name": "Ahmad Khalil",
  "phone": "+9611234567",
  "monthly_income": 1200,
  "employment_type": "salaried",
  "credolab_id": "credo_abc123"
}

// Response
{
  "user_id": "uuid-here",
  "trust_score": 73,
  "band": { "label": "good", "max_credit_usd": 2500 },
  "breakdown": {
    "base_score": 48,
    "completeness_bonus": 20,
    "employment_bonus": 8,
    "income_bonus": 2.4,
    "note": "MVP mock — will be replaced with real scoring model"
  },
  "calculated_at": "2026-02-28T06:07:00.000Z"
}
```

### `POST /api/v1/credolab/score`

Fetch and store Credolab behavioral score.

```json
// Request
{ "user_id": "uuid-here", "credolab_id": "credo_abc123" }

// Response
{
  "user_id": "uuid-here",
  "credolab_id": "credo_abc123",
  "behavioral_score": 72,
  "risk_category": "medium_risk",
  "stored": true,
  "fetched_at": "2026-02-28T06:07:00.000Z"
}
```

## Roadmap

- [ ] Real Credolab API integration
- [ ] JWT authentication + role-based access
- [ ] Merchant onboarding endpoints
- [ ] Installment scheduling + payment tracking
- [ ] Lebanese banking API integration (if available)
- [ ] SMS verification (OTP via Twilio or local provider)
- [ ] Admin dashboard API

## Why Lebanon?

Traditional credit scoring doesn't work here — most people are unbanked or underbanked, and the credit bureau infrastructure is limited. Behavioral scoring via phone metadata (Credolab) + merchant trust networks can fill that gap.

---

**Stack:** Node.js · Express · PostgreSQL · Flutter  
**Status:** MVP — Mock scoring engine  
**License:** Private
