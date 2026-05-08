/**
 * Server entry point
 */

const app = require('./src/app');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`[server] AI Spend Audit API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('[server] HTTP server closed');
    process.exit(0);
  });
});
