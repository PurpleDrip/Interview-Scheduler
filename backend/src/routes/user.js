import express from 'express';
import {
  createUser,
  getUserById,
  getUserByEmail,
  getUsersByRole,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { validateUserCreation, validateMongoId } from '../middleware/validator.js';

const router = express.Router();

/**
 * User Routes
 */

// Create new user
router.post('/', validateUserCreation, createUser);

// Get user by ID
router.get('/:id', validateMongoId('id'), getUserById);

// Get user by email
router.get('/email/:email', getUserByEmail);

// Get users by role
router.get('/role/:role', getUsersByRole);

// Update user
router.put('/:id', validateMongoId('id'), updateUser);

// Delete user
router.delete('/:id', validateMongoId('id'), deleteUser);

export default router;
