const express = require('express');
const axios = require('axios');
const winston = require('winston');

const app = express();
const PORT = 8080;

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'gateway.log' })
  ]
});

app.use(express.json());

// Route to test both blockchain implementations
app.post('/auth', async (req, res) => {
  try {
    // Test first blockchain implementation
    const response1 = await axios.post('http://auth-service-1:3000/authenticate', req.body);
    
    // Test second blockchain implementation
    const response2 = await axios.post('http://auth-service-2:3000/authenticate', req.body);

    // Log responses for monitoring
    logger.info('Authentication requests completed', {
      auth1: response1.data,
      auth2: response2.data
    });

    res.json({
      auth1_result: response1.data,
      auth2_result: response2.data
    });
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  logger.info(`API Gateway listening on port ${PORT}`);
});