const express = require('express');
const winston = require('winston');
const fetch = require('node-fetch');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs').promises;

const app = express();
const PORT = 5000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'analytics.log' })
  ]
});

// Create CSV writer for results
const csvWriter = createCsvWriter({
  path: './results/comparison.csv',
  header: [
    {id: 'timestamp', title: 'TIMESTAMP'},
    {id: 'method', title: 'METHOD'},
    {id: 'duration', title: 'DURATION_MS'},
    {id: 'success', title: 'SUCCESS'},
    {id: 'memoryUsage', title: 'MEMORY_USAGE_MB'},
    {id: 'cpuUsage', title: 'CPU_USAGE_PERCENT'}
  ]
});

async function generateReport() {
  try {
    // Fetch metrics from monitoring service
    const response = await fetch('http://monitoring:9090/metrics');
    const metrics = await response.text();

    // Process metrics and generate report
    const report = {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      summary: {
        hyperledger: {
          avgDuration: 0,
          successRate: 0,
          totalRequests: 0
        },
        ethereum: {
          avgDuration: 0,
          successRate: 0,
          totalRequests: 0
        }
      }
    };

    // Write report to file
    await fs.writeFile(
      `./results/report-${report.timestamp}.json`,
      JSON.stringify(report, null, 2)
    );

    logger.info('Generated report', { timestamp: report.timestamp });
    return report;
  } catch (error) {
    logger.error('Report generation failed', { error: error.message });
    throw error;
  }
}

// Generate report every hour
setInterval(generateReport, 3600000);

// Endpoint to trigger manual report generation
app.post('/generate-report', async (req, res) => {
  try {
    const report = await generateReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  logger.info(`Analytics service listening on port ${PORT}`);
});