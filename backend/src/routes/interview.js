import express from 'express';
import {
  matchInterviewSlots,
  confirmInterview,
  getInterviewById,
  getInterviewsByUser,
  cancelInterview,
} from '../controllers/interviewController.js';
import {
  validateInterviewMatching,
  validateInterviewConfirmation,
  validateMongoId,
} from '../middleware/validator.js';

const router = express.Router();

/**
 * Interview Routes
 */

// Match interview slots between candidate and interviewer
router.post('/match', validateInterviewMatching, matchInterviewSlots);

// Confirm interview and send calendar invites
router.post('/confirm', validateInterviewConfirmation, confirmInterview);

// Get interview by ID
router.get('/:id', validateMongoId('id'), getInterviewById);

// Get all interviews for a user
router.get('/user/:userId', validateMongoId('userId'), getInterviewsByUser);

// Cancel interview
router.put('/:id/cancel', validateMongoId('id'), cancelInterview);

export default router;
