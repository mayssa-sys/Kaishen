const request = require('supertest');
const app = require('../src/app');

describe('POST /api/v1/score', () => {
  it('returns a trust score for valid input', async () => {
    const res = await request(app)
      .post('/api/v1/score')
      .send({
        user_id: 'test-user-001',
        full_name: 'Ahmad Khalil',
        phone: '+9611234567',
        monthly_income: 1200,
        employment_type: 'salaried',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('trust_score');
    expect(res.body.trust_score).toBeGreaterThanOrEqual(0);
    expect(res.body.trust_score).toBeLessThanOrEqual(100);
    expect(res.body).toHaveProperty('band');
    expect(res.body).toHaveProperty('breakdown');
  });

  it('rejects requests missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/score')
      .send({ user_id: 'test-user-001' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns score between 0-100 even with minimal data', async () => {
    const res = await request(app)
      .post('/api/v1/score')
      .send({
        user_id: 'test-user-002',
        full_name: 'Sara Nassar',
        phone: '+9619876543',
      });

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
