/**
 * Utility functions for time and date operations
 */

/**
 * Checks if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
  return date < new Date();
};

/**
 * Checks if a date is within business hours (9 AM - 6 PM)
 * @param {Date} date - Date to check
 * @returns {boolean} True if within business hours
 */
export const isBusinessHours = (date) => {
  const hour = date.getHours();
  return hour >= 9 && hour < 18;
};

/**
 * Checks if a date is on a weekday (Monday-Friday)
 * @param {Date} date - Date to check
 * @returns {boolean} True if weekday
 */
export const isWeekday = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

/**
 * Adds minutes to a date
 * @param {Date} date - Starting date
 * @param {number} minutes - Minutes to add
 * @returns {Date} New date with added minutes
 */
export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

/**
 * Gets the duration between two dates in minutes
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {number} Duration in minutes
 */
export const getDurationMinutes = (start, end) => {
  return Math.round((end - start) / (1000 * 60));
};

/**
 * Checks if two time slots overlap
 * @param {Object} slot1 - First time slot {start, end}
 * @param {Object} slot2 - Second time slot {start, end}
 * @returns {boolean} True if slots overlap
 */
export const slotsOverlap = (slot1, slot2) => {
  return slot1.start < slot2.end && slot2.start < slot1.end;
};

/**
 * Rounds a date to the nearest interval
 * @param {Date} date - Date to round
 * @param {number} intervalMinutes - Interval in minutes (default: 15)
 * @returns {Date} Rounded date
 */
export const roundToInterval = (date, intervalMinutes = 15) => {
  const ms = 1000 * 60 * intervalMinutes;
  return new Date(Math.round(date.getTime() / ms) * ms);
};

/**
 * Validates that a time slot is reasonable
 * @param {Date} start - Start time
 * @param {Date} end - End time
 * @returns {Object} Validation result {isValid, error}
 */
export const validateTimeSlot = (start, end) => {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    return { isValid: false, error: 'Invalid date objects' };
  }

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date values' };
  }

  if (end <= start) {
    return { isValid: false, error: 'End time must be after start time' };
  }

  if (isPast(start)) {
    return { isValid: false, error: 'Start time cannot be in the past' };
  }

  const durationMinutes = getDurationMinutes(start, end);
  if (durationMinutes < 15) {
    return { isValid: false, error: 'Time slot must be at least 15 minutes' };
  }

  if (durationMinutes > 480) {
    return { isValid: false, error: 'Time slot cannot exceed 8 hours' };
  }

  return { isValid: true };
};
