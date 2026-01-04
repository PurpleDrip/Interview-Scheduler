import { logError } from '../utils/logger.js';

/**
 * Global error handling middleware
 * Catches all errors and returns consistent error responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logError(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Determine if we should expose error details
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Build error response
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(isDevelopment && { stack: err.stack }),
      ...(err.errors && { details: err.errors }),
    },
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
