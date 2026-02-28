require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    connectionString: process.env.DATABASE_URL || 'postgresql://kaishen:password@localhost:5432/kaishen_mvp',
  },
  credolab: {
    apiUrl: process.env.CREDOLAB_API_URL || 'https://api.credolab.com/v1',
    apiKey: process.env.CREDOLAB_API_KEY || '',
  },
  trustScore: {
    min: parseInt(process.env.TRUST_SCORE_MIN, 10) || 0,
    max: parseInt(process.env.TRUST_SCORE_MAX, 10) || 100,
  },
};
