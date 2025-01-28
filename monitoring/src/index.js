const express = require('express');
const winston = require('winston');
const prometheus = require('prometheus-client');

const app = express();
const PORT = 9090;

// Create metrics
const authDuration = new prometheus.Histogram({
  name: 'auth_duration_seconds',
  help: 'Authentication duration in seconds',
  labelNames: ['method']
});

const authSuccess = new prometheus.Counter({
  name: 'auth_success_total',
  help: 'Total successful authentications',
  labelNames: ['method']
});

const authFailure = new prometheus.Counter({
  name: 'auth_failure_total',
  help: 'Total failed authentications',
  labelNames: ['method']
});

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'monitoring.log' })
  ]
});

// Endpoint for Prometheus to scrape metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// Endpoint to record metrics
app.post('/record', express.json(), (req, res) => {
  const { method, duration, success } = req.body;
  
  authDuration.observe({ method }, duration);
  if (success) {
    authSuccess.inc({ method });
  } else {
    authFailure.inc({ method });
  }
  
  logger.info('Recorded metrics', { method, duration, success });
  res.json({ status: 'recorded' });
});

app.listen(PORT, () => {
  logger.info(`Monitoring service listening on port ${PORT}`);
});