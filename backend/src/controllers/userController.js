import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * User Controller
 * Handles user-related operations
 */

/**
 * Create a new user (candidate or interviewer)
 * POST /api/users
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, role, timezone, phone, company, position } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: { message: 'User with this email already exists' },
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    role,
    timezone: timezone || 'UTC',
    phone,
    company,
    position,
  });

  logInfo(`User created: ${user.email} (${user.role})`);

  res.status(201).json({
    success: true,
    data: { user },
  });
});

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' },
    });
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * Get user by email
 * GET /api/users/email/:email
 */
export const getUserByEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email.toLowerCase() });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' },
    });
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * Get all users by role
 * GET /api/users/role/:role
 */
export const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;

  if (!['candidate', 'interviewer'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid role. Must be candidate or interviewer' },
    });
  }

  const users = await User.find({ role }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { users, count: users.length },
  });
});

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { name, timezone, phone, company, position } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' },
    });
  }

  // Update fields
  if (name) user.name = name;
  if (timezone) user.timezone = timezone;
  if (phone !== undefined) user.phone = phone;
  if (company !== undefined) user.company = company;
  if (position !== undefined) user.position = position;

  await user.save();

  logInfo(`User updated: ${user.email}`);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' },
    });
  }

  await user.deleteOne();

  logInfo(`User deleted: ${user.email}`);

  res.status(200).json({
    success: true,
    data: { message: 'User deleted successfully' },
  });
});
