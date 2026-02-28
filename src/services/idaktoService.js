const config = require('../config');
const db = require('../models/db');
async function verifyIdentity(userId, idData) {
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
  const verificationId = 'idkt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const mockResult = {
    verificationId,
    status: Math.random() > 0.15 ? 'verified' : 'rejected',
    documentType: idData.document_type || 'national_id',
    checks: {
      document_authentic: Math.random() > 0.1,
      face_match: Math.random() > 0.12,
      not_expired: Math.random() > 0.05,
      data_consistent: Math.random() > 0.08,
      liveness_passed: Math.random() > 0.1
    },
    extractedData: {
      full_name: idData.full_name || 'N/A',
      date_of_birth: '1990-01-15',
      nationality: 'Lebanese',
      document_number: 'LB' + Math.floor(Math.random() * 900000 + 100000),
      expiry_date: '2028-06-30'
    },
    riskScore: Math.round(Math.random() * 100),
    verifiedAt: new Date().toISOString()
  };
  if (!mockResult.checks.document_authentic || !mockResult.checks.face_match || !mockResult.checks.liveness_passed) {
    mockResult.status = 'rejected';
  }
  let stored = false;
  try {
    await db.query('INSERT INTO kyc_verifications (user_id, verification_id, status, document_type, checks, extracted_data, risk_score, verified_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [userId, verificationId, mockResult.status, mockResult.documentType, JSON.stringify(mockResult.checks), JSON.stringify(mockResult.extractedData), mockResult.riskScore, mockResult.verifiedAt]);
    stored = true;
  } catch (err) { console.warn('[idakto] DB store failed:', err.message); stored = false; }
  return { ...mockResult, stored };
}
async function getVerificationStatus(verificationId) {
  return { verificationId, status: 'verified', updatedAt: new Date().toISOString() };
}
module.exports = { verifyIdentity, getVerificationStatus };
