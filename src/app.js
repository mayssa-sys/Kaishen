const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const scoreRoutes = require('./routes/score');
const credolabRoutes = require('./routes/credolab');
const healthRoutes = require('./routes/health');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/score', scoreRoutes);
app.use('/api/v1/credolab', credolabRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('[kaishen] Error:', err.message);
  res.status(err.status || 500).json({
    error: req.app.get('env') === 'development' ? err.message : 'Internal server error',
  });
});

module.exports = app;
