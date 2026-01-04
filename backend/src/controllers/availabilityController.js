import Availability from '../models/Availability.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parseAvailabilityText, validateParsedSlots } from '../services/aiParser.js';
import { validateTimeSlot } from '../utils/timeUtils.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * Availability Controller
 * Handles availability submission and retrieval
 */

/**
 * Submit availability (structured or free-text)
 * POST /api/availability
 */
export const submitAvailability = asyncHandler(async (req, res) => {
  const { userId, timeSlots, rawText, validUntil, notes } = req.body;

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' },
    });
  }

  let finalTimeSlots = [];
  let inputMethod = 'structured';
  let parsedByAI = false;
  let parsingConfidence = 1.0;

  // If raw text is provided, use AI to parse it
  if (rawText && rawText.trim()) {
    logInfo(`Parsing availability text for user ${userId}`);
    
    const parseResult = await parseAvailabilityText(rawText, user.timezone);
    
    if (parseResult.error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Failed to parse availability text',
          details: parseResult.interpretation,
        },
      });
    }

    finalTimeSlots = parseResult.timeSlots;
    inputMethod = 'ai-parsed';
    parsedByAI = true;
    parsingConfidence = parseResult.confidence;

    // Validate parsed slots
    const validation = validateParsedSlots(finalTimeSlots);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Parsed time slots are invalid',
          details: validation.issues,
        },
      });
    }
  } else if (timeSlots && timeSlots.length > 0) {
    // Use structured time slots
    finalTimeSlots = timeSlots.map((slot) => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
    }));

    // Validate each slot
    for (const slot of finalTimeSlots) {
      const validation = validateTimeSlot(slot.start, slot.end);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid time slot',
            details: validation.error,
          },
        });
      }
    }
  } else {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide either time slots or availability text' },
    });
  }

  // Create availability record
  const availability = await Availability.create({
    userId,
    timeSlots: finalTimeSlots,
    rawText: rawText || '',
    inputMethod,
    parsedByAI,
    parsingConfidence,
    validUntil: new Date(validUntil),
    notes: notes || '',
  });

  logInfo(`Availability submitted for user ${userId}: ${finalTimeSlots.length} slots`);

  res.status(201).json({
    success: true,
    data: {
      availability,
      message: parsedByAI
        ? `Successfully parsed ${finalTimeSlots.length} time slots with ${Math.round(parsingConfidence * 100)}% confidence`
        : `Successfully added ${finalTimeSlots.length} time slots`,
    },
  });
});

/**
 * Get availability by user ID
 * GET /api/availability/user/:userId
 */
export const getAvailabilityByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get all valid availability for user
  const now = new Date();
  const availability = await Availability.find({
    userId,
    validUntil: { $gte: now },
  })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email role');

  res.status(200).json({
    success: true,
    data: { availability, count: availability.length },
  });
});

/**
 * Get availability by ID
 * GET /api/availability/:id
 */
export const getAvailabilityById = asyncHandler(async (req, res) => {
  const availability = await Availability.findById(req.params.id).populate(
    'userId',
    'name email role'
  );

  if (!availability) {
    return res.status(404).json({
      success: false,
      error: { message: 'Availability not found' },
    });
  }

  res.status(200).json({
    success: true,
    data: { availability },
  });
});

/**
 * Update availability
 * PUT /api/availability/:id
 */
export const updateAvailability = asyncHandler(async (req, res) => {
  const { timeSlots, validUntil, notes } = req.body;

  const availability = await Availability.findById(req.params.id);

  if (!availability) {
    return res.status(404).json({
      success: false,
      error: { message: 'Availability not found' },
    });
  }

  // Update time slots if provided
  if (timeSlots && timeSlots.length > 0) {
    const updatedSlots = timeSlots.map((slot) => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
    }));

    // Validate each slot
    for (const slot of updatedSlots) {
      const validation = validateTimeSlot(slot.start, slot.end);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid time slot',
            details: validation.error,
          },
        });
      }
    }

    availability.timeSlots = updatedSlots;
  }

  if (validUntil) availability.validUntil = new Date(validUntil);
  if (notes !== undefined) availability.notes = notes;

  await availability.save();

  logInfo(`Availability updated: ${availability._id}`);

  res.status(200).json({
    success: true,
    data: { availability },
  });
});

/**
 * Delete availability
 * DELETE /api/availability/:id
 */
export const deleteAvailability = asyncHandler(async (req, res) => {
  const availability = await Availability.findById(req.params.id);

  if (!availability) {
    return res.status(404).json({
      success: false,
      error: { message: 'Availability not found' },
    });
  }

  await availability.deleteOne();

  logInfo(`Availability deleted: ${req.params.id}`);

  res.status(200).json({
    success: true,
    data: { message: 'Availability deleted successfully' },
  });
});
