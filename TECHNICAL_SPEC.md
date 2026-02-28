# Kaishen — Technical Specification
## Lebanon's First AI-Driven Buy Now, Pay Later Platform

**Version:** 0.1 (MVP)
**Last Updated:** February 28, 2026
**Status:** Pre-launch

---

## 1. What Is Kaishen?

Kaishen lets Lebanese consumers split purchases into installments at partner merchants — without needing a bank account, credit card, or credit history. Instead of traditional credit checks (which barely exist in Lebanon), Kaishen uses **behavioral AI scoring** from phone metadata to decide who gets credit and how much.

---

## 2. How It Works (Simple Version)

```
Consumer walks into a partner store
        ↓
Opens Kaishen app, scans a QR code at checkout
        ↓
App checks their Trust Score (calculated by AI)
        ↓
If approved: purchase is split into 3-4 monthly payments
        ↓
Merchant gets paid immediately by Kaishen
        ↓
Consumer pays Kaishen back over time
```

---

## 3. The Three Users

### Consumer (the buyer)
- Downloads the Kaishen app
- Creates an account (name, phone, ID photo)
- Gets a Trust Score automatically
- Can shop at partner merchants and pay in installments

### Merchant (the store)
- Signs up through a merchant portal or sales team
- Gets a QR code for their checkout counter
- Receives full payment from Kaishen within 24-48 hours
- Pays Kaishen a small commission (3-6% per transaction)

### Admin (Kaishen team)
- Dashboard to monitor transactions, defaults, scores
- Manage merchants, approve/reject edge cases
- View analytics and risk reports

---

## 4. The Trust Engine (How Scoring Works)

This is Kaishen's core innovation. Instead of credit bureau data, we use:

| Signal | What It Is | Why It Matters |
|--------|-----------|----------------|
| **Behavioral scoring (Credolab)** | AI analyzes how someone uses their phone — app patterns, typing speed, device care | Predicts financial responsibility without bank data |
| **Income verification** | Payslips, bank statement uploads, or employer verification | Confirms ability to repay |
| **Profile completeness** | Did they fill out their full profile, upload ID, verify phone? | People who invest effort are lower risk |
| **Employment type** | Salaried, self-employed, freelance | Affects risk level and credit limit |
| **Transaction history** | After first purchase — did they pay on time? | Builds internal credit history over time |
| **Merchant vouching** | Merchants can vouch for regular customers | Social trust layer unique to Lebanon |

### Score Bands

| Score | Band | Max Credit (USD) | What Happens |
|-------|------|-------------------|--------------|
| 80-100 | Excellent | $5,000 | Instant approval, best terms |
| 60-79 | Good | $2,500 | Approved, standard terms |
| 40-59 | Fair | $1,000 | Approved, smaller limit |
| 20-39 | Poor | $250 | Very small purchases only |
| 0-19 | Reject | $0 | Denied — can retry in 30 days |

---

## 5. MVP Features (What to Build First)

### Phase 1: Core (Weeks 1-4)
- [ ] Consumer registration (phone + OTP verification)
- [ ] Trust Score calculation (Credolab integration)
- [ ] Single merchant onboarding (manual)
- [ ] QR code payment flow
- [ ] Split payment into 4 equal installments
- [ ] Basic payment tracking
- [ ] Admin dashboard (web)

### Phase 2: Growth (Weeks 5-8)
- [ ] Multiple merchant support
- [ ] Merchant self-service portal
- [ ] Push notifications for payment reminders
- [ ] Score improvement over time (good payment history = higher limit)
- [ ] KYC/ID verification (photo ID upload)

### Phase 3: Scale (Months 3-6)
- [ ] Integration with Lebanese payment processors
- [ ] Merchant analytics dashboard
- [ ] Collections workflow for late payments
- [ ] Referral program
- [ ] Arabic language support
- [ ] Advanced AI scoring model

---

## 6. Technology Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Mobile App** (consumer) | Flutter | One codebase for iOS + Android |
| **Merchant App/Portal** | Flutter or React web | Depends on merchant needs |
| **Backend API** | Node.js + Express | Fast to build, easy to hire for |
| **Database** | PostgreSQL | Reliable, handles financial data well |
| **Behavioral Scoring** | Credolab SDK | Best-in-class for emerging markets |
| **Hosting** | Railway → AWS later | Start cheap, scale when needed |
| **Payments** | TBD (local processor) | Need to research Lebanese options |
| **SMS/OTP** | Twilio or local provider | Phone verification |
| **File Storage** | AWS S3 or Cloudflare R2 | ID photos, documents |

---

## 7. Database Schema (What Data We Store)

### Users Table
- ID, full name, phone number, email
- Monthly income, employment type
- Trust score (current), score history
- KYC status (pending/verified/rejected)
- Created date, last active date

### Transactions Table
- ID, user ID, merchant ID
- Purchase amount, number of installments
- Status (pending/active/completed/defaulted)
- Payment schedule (dates + amounts)
- Created date

### Merchants Table
- ID, business name, contact person
- Phone, email, address
- Commission rate
- Status (active/suspended)
- QR code reference

### Credolab Scores Table
- ID, user ID, Credolab reference ID
- Raw score (0-1000), normalized score (0-100)
- Risk category
- Module breakdowns (device integrity, app usage, financial behavior)
- Fetch date

### Payments Table
- ID, transaction ID, installment number
- Amount due, amount paid
- Due date, paid date
- Status (upcoming/due/paid/late/defaulted)

---

## 8. API Endpoints (What the Apps Talk To)

### Authentication
- `POST /api/v1/auth/register` — Create account with phone
- `POST /api/v1/auth/verify-otp` — Verify phone number
- `POST /api/v1/auth/login` — Log in, get access token

### Consumer
- `GET /api/v1/user/profile` — Get my profile
- `PUT /api/v1/user/profile` — Update my info
- `GET /api/v1/user/score` — Get my Trust Score
- `POST /api/v1/user/kyc` — Upload ID for verification

### Transactions
- `POST /api/v1/transactions/initiate` — Start a purchase (scan QR)
- `GET /api/v1/transactions` — My purchase history
- `GET /api/v1/transactions/:id` — Single transaction details
- `GET /api/v1/transactions/:id/schedule` — Payment schedule

### Payments
- `POST /api/v1/payments/:id/pay` — Make a payment
- `GET /api/v1/payments/upcoming` — My upcoming payments

### Merchant
- `GET /api/v1/merchant/dashboard` — Sales overview
- `GET /api/v1/merchant/transactions` — Transaction history
- `POST /api/v1/merchant/qr` — Generate QR code

### Admin
- `GET /api/v1/admin/users` — All users
- `GET /api/v1/admin/transactions` — All transactions
- `GET /api/v1/admin/risk` — Risk overview / defaults

### Scoring (already built ✅)
- `POST /api/v1/score` — Calculate Trust Score
- `POST /api/v1/credolab/score` — Fetch behavioral score

---

## 9. Revenue Model

| Source | How | Typical Rate |
|--------|-----|-------------|
| **Merchant commission** | % of each BNPL transaction | 3-6% |
| **Late fees** | Charged to consumers who miss payments | Fixed fee per missed payment |
| **Premium tiers** | Higher credit limits for subscribers | $2-5/month |

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **High default rate** | Conservative initial credit limits + behavioral scoring |
| **Currency instability (LBP)** | Transactions in USD or pegged amounts |
| **Regulatory uncertainty** | Consult Lebanese fintech legal counsel before launch |
| **Merchant adoption** | Start with 5-10 merchants, prove the model, then scale |
| **Fraud** | Credolab device fingerprinting + KYC verification |

---

## 11. What's Already Built

The backend repository (`kaishen-mvp-backend`) includes:
- ✅ Express REST API with security middleware
- ✅ Trust Score endpoint with mock scoring engine
- ✅ Credolab integration service (mock)
- ✅ PostgreSQL schema for all tables
- ✅ Health check endpoint
- ✅ Dockerfile for deployment
- ✅ Railway deployment config
- ✅ Test suite (4 passing)
- ✅ Deployed (or deploying) on Railway

**GitHub:** [your-repo-url-here]

---

## 12. What a Developer Needs to Do Next

If you're handing this to a developer, here's the priority order:

1. **JWT Authentication** — secure the endpoints (2-3 days)
2. **OTP/SMS verification** — phone-based registration (1-2 days)
3. **Real Credolab integration** — replace mock with actual API (2-3 days)
4. **Transaction flow** — initiate purchase, create installment schedule (3-5 days)
5. **Payment tracking** — mark installments as paid/late (2-3 days)
6. **Flutter consumer app** — registration, score view, QR scan, payment history (2-3 weeks)
7. **Merchant portal** — basic web dashboard (1-2 weeks)
8. **Admin dashboard** — monitoring and management (1-2 weeks)

**Estimated total for a working MVP:** 6-8 weeks with one full-time developer.

---

## 13. Hiring a Developer

### What to look for:
- Experience with Node.js + Express + PostgreSQL
- Has built a mobile app with Flutter (or React Native)
- Bonus: fintech or payments experience
- Bonus: familiar with the Lebanese market

### Where to find them:
- **Lebanon:** Post on LinkedIn targeting LAU/AUB/USJ CS graduates
- **Freelance:** Upwork, Toptal (search "Node.js + Flutter + fintech")
- **Communities:** Lebanese tech Telegram/WhatsApp groups, BDD (Beirut Digital District) network

### Budget estimate (Lebanon-based developer):
- Junior: $800-1,500/month
- Mid-level: $1,500-3,000/month
- Senior: $3,000-5,000/month
- Freelance (project-based): $5,000-15,000 for full MVP

---

*This document is your blueprint. Any developer who reads this can build Kaishen.*
