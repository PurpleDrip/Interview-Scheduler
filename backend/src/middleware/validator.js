import { body, param, validationResult } from 'express-validator';

/**
 * Validation middleware using express-validator
 */

/**
 * Handles validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      },
    });
  }
  
  next();
};

/**
 * Validation rules for user creation
 */
export const validateUserCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['candidate', 'interviewer'])
    .withMessage('Role must be either candidate or interviewer'),
  
  body('timezone')
    .optional()
    .trim(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors,
];

/**
 * Validation rules for availability submission
 */
export const validateAvailabilitySubmission = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  body('timeSlots')
    .optional()
    .isArray()
    .withMessage('Time slots must be an array'),
  
  body('timeSlots.*.start')
    .optional()
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  
  body('timeSlots.*.end')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  
  body('rawText')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Availability text cannot exceed 1000 characters'),
  
  body('validUntil')
    .notEmpty()
    .withMessage('Valid until date is required')
    .isISO8601()
    .withMessage('Valid until must be a valid ISO 8601 date'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  handleValidationErrors,
];

/**
 * Validation rules for interview matching
 */
export const validateInterviewMatching = [
  body('candidateId')
    .notEmpty()
    .withMessage('Candidate ID is required')
    .isMongoId()
    .withMessage('Invalid candidate ID format'),
  
  body('interviewerId')
    .notEmpty()
    .withMessage('Interviewer ID is required')
    .isMongoId()
    .withMessage('Invalid interviewer ID format'),
  
  body('duration')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  
  handleValidationErrors,
];

/**
 * Validation rules for interview confirmation
 */
export const validateInterviewConfirmation = [
  body('interviewId')
    .notEmpty()
    .withMessage('Interview ID is required')
    .isMongoId()
    .withMessage('Invalid interview ID format'),
  
  body('selectedSlotIndex')
    .notEmpty()
    .withMessage('Selected slot index is required')
    .isInt({ min: 0, max: 2 })
    .withMessage('Selected slot index must be 0, 1, or 2'),
  
  body('meetingLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Meeting link must be a valid URL'),
  
  body('location')
    .optional()
    .trim(),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors,
];

/**
 * Validation for MongoDB ObjectId params
 */
export const validateMongoId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors,
];
