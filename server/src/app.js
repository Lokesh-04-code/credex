/**
 * Express App — AI Spend Audit API
 *
 * Architecture:
 * - Security: helmet (HTTP headers) + cors (origin whitelist)
 * - Logging: morgan (request logs)
 * - Rate limiting: express-rate-limit (per-route tiers)
 * - Routes: /api/audit, /api/leads
 * - Error handling: centralized middleware
 */

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const auditRoutes = require('./routes/audit.routes');
const leadsRoutes = require('./routes/leads.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter, auditLimiter, leadLimiter } = require('./middleware/rateLimiter');

const app = express();

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/audit', auditLimiter, auditRoutes);
app.use('/api/leads', leadLimiter, leadsRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.', code: 'NOT_FOUND' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
