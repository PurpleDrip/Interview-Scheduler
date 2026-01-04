import express from 'express';
import {
  submitAvailability,
  getAvailabilityByUser,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
} from '../controllers/availabilityController.js';
import {
  validateAvailabilitySubmission,
  validateMongoId,
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Availability Routes
 */

// Submit availability (structured or free-text)
router.post('/', validateAvailabilitySubmission, submitAvailability);

// Get availability by user ID
router.get('/user/:userId', validateMongoId('userId'), getAvailabilityByUser);

// Get availability by ID
router.get('/:id', validateMongoId('id'), getAvailabilityById);

// Update availability
router.put('/:id', validateMongoId('id'), updateAvailability);

// Delete availability
router.delete('/:id', validateMongoId('id'), deleteAvailability);

export default router;
