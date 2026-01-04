/**
 * Simple logging utility
 * Can be extended to use Winston or other logging libraries
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * Formats a log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

/**
 * Logs an error message
 * @param {string} message - Error message
 * @param {Object} meta - Additional metadata
 */
export const logError = (message, meta = {}) => {
  console.error(formatLog(LOG_LEVELS.ERROR, message, meta));
};

/**
 * Logs a warning message
 * @param {string} message - Warning message
 * @param {Object} meta - Additional metadata
 */
export const logWarn = (message, meta = {}) => {
  console.warn(formatLog(LOG_LEVELS.WARN, message, meta));
};

/**
 * Logs an info message
 * @param {string} message - Info message
 * @param {Object} meta - Additional metadata
 */
export const logInfo = (message, meta = {}) => {
  console.log(formatLog(LOG_LEVELS.INFO, message, meta));
};

/**
 * Logs a debug message (only in development)
 * @param {string} message - Debug message
 * @param {Object} meta - Additional metadata
 */
export const logDebug = (message, meta = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(formatLog(LOG_LEVELS.DEBUG, message, meta));
  }
};

export default {
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
};
