import mongoose from 'mongoose';

/**
 * Availability Schema
 * Stores user availability windows for interview scheduling
 * Supports both structured time slots and free-text input for AI parsing
 */
const availabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    timeSlots: [
      {
        start: {
          type: Date,
          required: [true, 'Start time is required'],
        },
        end: {
          type: Date,
          required: [true, 'End time is required'],
        },
        _id: false,
      },
    ],
    rawText: {
      type: String,
      trim: true,
      maxlength: [1000, 'Availability text cannot exceed 1000 characters'],
    },
    inputMethod: {
      type: String,
      enum: ['structured', 'freetext', 'ai-parsed'],
      default: 'structured',
    },
    parsedByAI: {
      type: Boolean,
      default: false,
    },
    parsingConfidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    validUntil: {
      type: Date,
      required: [true, 'Validity date is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Validate that end time is after start time for each slot
availabilitySchema.pre('save', function (next) {
  for (const slot of this.timeSlots) {
    if (slot.end <= slot.start) {
      return next(new Error('End time must be after start time'));
    }
  }
  next();
});

// Index for efficient user lookups
availabilitySchema.index({ userId: 1, createdAt: -1 });

// Index for finding valid availability
availabilitySchema.index({ validUntil: 1 });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
