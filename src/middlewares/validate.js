/**
 * Simple request validation middleware.
 * Will be replaced with Joi or Zod in production.
 */

function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
}

module.exports = { requireFields };
