const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const scoreRoutes = require('./routes/score');
const credolabRoutes = require('./routes/credolab');
const healthRoutes = require('./routes/health');
const idaktoRoutes = require('./routes/idakto');
const authRoutes = require('./routes/auth');
const merchantRoutes = require('./routes/merchant');
const transactionRoutes = require('./routes/transaction');
const homepage = require('./public');
const app = express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.get('/', (req, res) => { res.send(homepage); });
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/score', scoreRoutes);
app.use('/api/v1/credolab', credolabRoutes);
app.use('/api/v1/kyc', idaktoRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/merchants', merchantRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use((req, res) => { res.status(404).json({ error: 'Not found' }); });
app.use((err, req, res, _next) => {
  console.error('[kaishen] Error:', err.message);
  res.status(err.status || 500).json({
    error: req.app.get('env') === 'development' ? err.message : 'Internal server error',
  });
});
module.exports = app;
