/**
 * Rate Limiter Middleware
 *
 * Design rationale:
 * - The audit endpoint does significant computation (AI call + DB write), so we
 *   apply a stricter limit: 10 audits per IP per 15 minutes.
 * - The leads endpoint is the most abuse-prone (spam signups), so we apply
 *   5 requests per IP per 15 minutes.
 * - The general API limit is 100 req/15min — enough for a real user, tight
 *   enough to deter automated scanning.
 *
 * We use express-rate-limit's memory store (default) which resets on restart.
 * For production at scale, switch to RedisStore.
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMITED' },
});

/**
 * Audit creation rate limiter — stricter
 */
const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many audits created. Please wait 15 minutes.', code: 'RATE_LIMITED' },
});

/**
 * Lead capture rate limiter — strictest
 */
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please wait 15 minutes.', code: 'RATE_LIMITED' },
});

module.exports = { generalLimiter, auditLimiter, leadLimiter };
