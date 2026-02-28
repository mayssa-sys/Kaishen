const idaktoService = require('../services/idaktoService');
exports.verifyIdentity = async (req, res, next) => {
  try {
    const { user_id, full_name, document_type, selfie_ref, document_ref } = req.body;
    if (!user_id || !document_type) {
      return res.status(400).json({ error: 'Missing required fields: user_id, document_type' });
    }
    const result = await idaktoService.verifyIdentity(user_id, req.body);
    res.json({ user_id, verification_id: result.verificationId, status: result.status, document_type: result.documentType, checks: result.checks, extracted_data: result.extractedData, risk_score: result.riskScore, stored: result.stored, verified_at: result.verifiedAt });
  } catch (err) { next(err); }
};
exports.getStatus = async (req, res, next) => {
  try {
    const { verification_id } = req.params;
    const result = await idaktoService.getVerificationStatus(verification_id);
    res.json(result);
  } catch (err) { next(err); }
};
