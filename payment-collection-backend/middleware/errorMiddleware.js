const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Global Express error handler — must be registered LAST after all routes.
 * Issue #8: Never exposes stack traces or raw error messages to the client in production.
 */
const errorHandler = (err, req, res, next) => {
  // Always log server-side; stack only in development
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (!isProduction()) console.error(err.stack);

  // Mongoose CastError — invalid ObjectId format
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // Mongoose ValidationError — schema constraint violations
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // MongoDB duplicate key (unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value: ${field} already exists`,
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    // Issue #8: In production, never surface internal error details to the client.
    message: isProduction() ? 'An internal server error occurred' : err.message,
  });
};

/**
 * 404 handler — catches any unmatched routes.
 * Issue #10: Set status on res (not on the error object) so errorHandler reads it correctly.
 *            Previously set error.statusCode = 404, which errorHandler never read,
 *            causing all 404s to be returned as 500.
 */
const notFound = (req, res, next) => {
  res.status(404); // ← correct: set on res, not on the error object
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
