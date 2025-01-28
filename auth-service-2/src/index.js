const express = require('express');
const winston = require('winston');
const EthereumAuth = require('./blockchain');

const app = express();
const PORT = 3000;
const auth = new EthereumAuth();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth2.log' })
  ]
});

app.use(express.json());

app.post('/authenticate', async (req, res) => {
  try {
    const result = await auth.authenticateUser(req.body);
    logger.info('Authentication completed', result);
    res.json(result);
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(PORT, async () => {
  await auth.initialize();
  logger.info(`Auth Service 2 (Ethereum) listening on port ${PORT}`);
});