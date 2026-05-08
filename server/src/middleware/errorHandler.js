/**
 * Global error handler middleware
 */

function errorHandler(err, req, res, next) {
  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this data already exists.', code: 'CONFLICT' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.', code: 'NOT_FOUND' });
  }

  // Default
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred.';

  if (process.env.NODE_ENV !== 'production') {
    console.error('[error]', err);
  } else {
    console.error(`[error] ${statusCode}: ${message}`);
  }

  return res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error.' : message,
    code: err.code || 'INTERNAL_ERROR',
  });
}

module.exports = { errorHandler };
