import mongoose from 'mongoose';

/**
 * Interview Schema
 * Manages interview scheduling with proposed and confirmed time slots
 */
const interviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate ID is required'],
      index: true,
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Interviewer ID is required'],
      index: true,
    },
    proposedSlots: [
      {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        _id: false,
      },
    ],
    selectedSlot: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'proposed', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    interviewType: {
      type: String,
      enum: ['technical', 'behavioral', 'hr', 'panel', 'other'],
      default: 'technical',
    },
    duration: {
      type: Number,
      default: 60,
      min: [15, 'Interview duration must be at least 15 minutes'],
      max: [480, 'Interview duration cannot exceed 8 hours'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    emailsSent: {
      type: Boolean,
      default: false,
    },
    calendarInviteSent: {
      type: Boolean,
      default: false,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding interviews by participants
interviewSchema.index({ candidateId: 1, interviewerId: 1 });

// Index for status-based queries
interviewSchema.index({ status: 1, createdAt: -1 });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
