import Interview from '../models/Interview.js';
import Availability from '../models/Availability.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { findMatchingSlots, mergeTimeSlots } from '../services/matchingAlgorithm.js';
import { sendInterviewProposalEmail, sendInterviewConfirmationEmail } from '../services/emailService.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * Interview Controller
 * Handles interview matching, scheduling, and confirmation
 */

/**
 * Find matching time slots between candidate and interviewer
 * POST /api/interview/match
 */
export const matchInterviewSlots = asyncHandler(async (req, res) => {
  const { candidateId, interviewerId, duration = 60, interviewType = 'technical' } = req.body;

  // Verify both users exist
  const candidate = await User.findById(candidateId);
  const interviewer = await User.findById(interviewerId);

  if (!candidate) {
    return res.status(404).json({
      success: false,
      error: { message: 'Candidate not found' },
    });
  }

  if (!interviewer) {
    return res.status(404).json({
      success: false,
      error: { message: 'Interviewer not found' },
    });
  }

  if (candidate.role !== 'candidate') {
    return res.status(400).json({
      success: false,
      error: { message: 'Specified user is not a candidate' },
    });
  }

  if (interviewer.role !== 'interviewer') {
    return res.status(400).json({
      success: false,
      error: { message: 'Specified user is not an interviewer' },
    });
  }

  // Get valid availability for both users
  const now = new Date();
  
  const candidateAvailability = await Availability.find({
    userId: candidateId,
    validUntil: { $gte: now },
  });

  const interviewerAvailability = await Availability.find({
    userId: interviewerId,
    validUntil: { $gte: now },
  });

  if (candidateAvailability.length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Candidate has no available time slots' },
    });
  }

  if (interviewerAvailability.length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Interviewer has no available time slots' },
    });
  }

  // Extract and merge time slots
  const candidateSlots = mergeTimeSlots(
    candidateAvailability.flatMap((avail) => avail.timeSlots)
  );

  const interviewerSlots = mergeTimeSlots(
    interviewerAvailability.flatMap((avail) => avail.timeSlots)
  );

  // Find matching slots
  const matchingSlots = findMatchingSlots(candidateSlots, interviewerSlots, duration);

  if (matchingSlots.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'No matching time slots found',
        details: 'Please update your availability or try a different duration',
      },
    });
  }

  // Create interview record with proposed slots
  const interview = await Interview.create({
    candidateId,
    interviewerId,
    proposedSlots: matchingSlots,
    status: 'proposed',
    interviewType,
    duration,
  });

  logInfo(`Interview slots matched: ${matchingSlots.length} options for candidate ${candidateId} and interviewer ${interviewerId}`);

  // Send email notification
  try {
    await sendInterviewProposalEmail({
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      interviewerName: interviewer.name,
      interviewerEmail: interviewer.email,
      proposedSlots: matchingSlots,
      interviewType,
    });

    interview.emailsSent = true;
    await interview.save();
  } catch (emailError) {
    logError('Failed to send proposal email', { error: emailError.message });
  }

  res.status(200).json({
    success: true,
    data: {
      interview,
      message: `Found ${matchingSlots.length} optimal time slot(s)`,
    },
  });
});

/**
 * Confirm interview slot and send calendar invites
 * POST /api/interview/confirm
 */
export const confirmInterview = asyncHandler(async (req, res) => {
  const { interviewId, selectedSlotIndex, meetingLink, location, notes } = req.body;

  const interview = await Interview.findById(interviewId)
    .populate('candidateId', 'name email')
    .populate('interviewerId', 'name email');

  if (!interview) {
    return res.status(404).json({
      success: false,
      error: { message: 'Interview not found' },
    });
  }

  if (interview.status === 'confirmed') {
    return res.status(400).json({
      success: false,
      error: { message: 'Interview is already confirmed' },
    });
  }

  if (selectedSlotIndex < 0 || selectedSlotIndex >= interview.proposedSlots.length) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid slot index' },
    });
  }

  // Set selected slot
  const selectedSlot = interview.proposedSlots[selectedSlotIndex];
  interview.selectedSlot = {
    start: selectedSlot.start,
    end: selectedSlot.end,
  };
  interview.status = 'confirmed';
  interview.meetingLink = meetingLink || '';
  interview.location = location || '';
  interview.notes = notes || '';

  await interview.save();

  logInfo(`Interview confirmed: ${interviewId} for slot ${selectedSlotIndex}`);

  // Send confirmation email with calendar invite
  try {
    await sendInterviewConfirmationEmail({
      candidateName: interview.candidateId.name,
      candidateEmail: interview.candidateId.email,
      interviewerName: interview.interviewerId.name,
      interviewerEmail: interview.interviewerId.email,
      confirmedSlot: interview.selectedSlot,
      meetingLink: interview.meetingLink,
      location: interview.location,
      interviewType: interview.interviewType,
      notes: interview.notes,
    });

    interview.calendarInviteSent = true;
    await interview.save();
  } catch (emailError) {
    logError('Failed to send confirmation email', { error: emailError.message });
    return res.status(500).json({
      success: false,
      error: {
        message: 'Interview confirmed but failed to send email notification',
        details: emailError.message,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      interview,
      message: 'Interview confirmed and calendar invites sent',
    },
  });
});

/**
 * Get interview by ID
 * GET /api/interview/:id
 */
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id)
    .populate('candidateId', 'name email role company')
    .populate('interviewerId', 'name email role company');

  if (!interview) {
    return res.status(404).json({
      success: false,
      error: { message: 'Interview not found' },
    });
  }

  res.status(200).json({
    success: true,
    data: { interview },
  });
});

/**
 * Get all interviews for a user
 * GET /api/interview/user/:userId
 */
export const getInterviewsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const interviews = await Interview.find({
    $or: [{ candidateId: userId }, { interviewerId: userId }],
  })
    .populate('candidateId', 'name email role')
    .populate('interviewerId', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { interviews, count: interviews.length },
  });
});

/**
 * Cancel interview
 * PUT /api/interview/:id/cancel
 */
export const cancelInterview = asyncHandler(async (req, res) => {
  const { userId, reason } = req.body;

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({
      success: false,
      error: { message: 'Interview not found' },
    });
  }

  if (interview.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      error: { message: 'Interview is already cancelled' },
    });
  }

  interview.status = 'cancelled';
  interview.cancelledBy = userId;
  interview.cancellationReason = reason || '';

  await interview.save();

  logInfo(`Interview cancelled: ${req.params.id} by user ${userId}`);

  res.status(200).json({
    success: true,
    data: {
      interview,
      message: 'Interview cancelled successfully',
    },
  });
});
