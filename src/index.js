const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`[kaishen] Server running on port ${config.port} (${config.nodeEnv})`);
});
