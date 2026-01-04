/**
 * Matching Algorithm Service
 * Finds optimal interview time slots between candidate and interviewer availability
 */

/**
 * Finds overlapping time slots between two availability sets
 * @param {Array} candidateSlots - Candidate's available time slots
 * @param {Array} interviewerSlots - Interviewer's available time slots
 * @param {number} requiredDuration - Required interview duration in minutes (default: 60)
 * @returns {Array} Up to 3 optimal matching time slots with scores
 */
export const findMatchingSlots = (candidateSlots, interviewerSlots, requiredDuration = 60) => {
  const matches = [];
  const requiredMs = requiredDuration * 60 * 1000;

  // Find all overlapping periods
  for (const candSlot of candidateSlots) {
    for (const intSlot of interviewerSlots) {
      const overlapStart = new Date(Math.max(candSlot.start.getTime(), intSlot.start.getTime()));
      const overlapEnd = new Date(Math.min(candSlot.end.getTime(), intSlot.end.getTime()));

      // Check if there's actual overlap
      if (overlapEnd > overlapStart) {
        const overlapDuration = overlapEnd - overlapStart;

        // Check if overlap is long enough for the interview
        if (overlapDuration >= requiredMs) {
          // Calculate interview end time
          const interviewEnd = new Date(overlapStart.getTime() + requiredMs);

          matches.push({
            start: overlapStart,
            end: interviewEnd,
            availableDuration: overlapDuration,
          });
        }
      }
    }
  }

  // Remove duplicate slots (same start time)
  const uniqueMatches = matches.filter(
    (match, index, self) =>
      index === self.findIndex((m) => m.start.getTime() === match.start.getTime())
  );

  // Score and rank the matches
  const scoredMatches = uniqueMatches.map((match) => ({
    ...match,
    score: calculateSlotScore(match),
  }));

  // Sort by score (highest first) and return top 3
  return scoredMatches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ availableDuration, ...rest }) => rest);
};

/**
 * Calculates a score for a time slot based on various factors
 * Higher score = more desirable slot
 * @param {Object} slot - Time slot to score
 * @returns {number} Score from 0-100
 */
const calculateSlotScore = (slot) => {
  let score = 50; // Base score

  const dayOfWeek = slot.start.getDay();
  const hour = slot.start.getHours();

  // Prefer weekdays over weekends
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    score += 20;
  } else {
    score -= 10;
  }

  // Prefer business hours (9 AM - 5 PM)
  if (hour >= 9 && hour < 17) {
    score += 20;
  } else if (hour >= 8 && hour < 18) {
    score += 10;
  } else {
    score -= 15;
  }

  // Prefer mid-morning or early afternoon (10 AM - 2 PM)
  if (hour >= 10 && hour < 14) {
    score += 10;
  }

  // Slight penalty for very early slots
  if (hour < 8) {
    score -= 10;
  }

  // Penalty for late evening slots
  if (hour >= 18) {
    score -= 5;
  }

  // Prefer slots that are not too far in the future (within 2 weeks)
  const daysUntilSlot = (slot.start - new Date()) / (1000 * 60 * 60 * 24);
  if (daysUntilSlot <= 14) {
    score += 10;
  } else if (daysUntilSlot > 30) {
    score -= 5;
  }

  // Bonus for slots with extra buffer time
  if (slot.availableDuration > 90 * 60 * 1000) {
    score += 5;
  }

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
};

/**
 * Checks if a specific time slot is available for both participants
 * @param {Date} proposedStart - Proposed interview start time
 * @param {Date} proposedEnd - Proposed interview end time
 * @param {Array} candidateSlots - Candidate's availability
 * @param {Array} interviewerSlots - Interviewer's availability
 * @returns {boolean} True if slot is available for both
 */
export const isSlotAvailable = (proposedStart, proposedEnd, candidateSlots, interviewerSlots) => {
  const checkAvailability = (slots) => {
    return slots.some((slot) => {
      return slot.start <= proposedStart && slot.end >= proposedEnd;
    });
  };

  return checkAvailability(candidateSlots) && checkAvailability(interviewerSlots);
};

/**
 * Merges overlapping or adjacent time slots
 * @param {Array} slots - Array of time slots
 * @returns {Array} Merged time slots
 */
export const mergeTimeSlots = (slots) => {
  if (slots.length === 0) return [];

  // Sort slots by start time
  const sorted = [...slots].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    // Check if current slot overlaps or is adjacent to the last merged slot
    if (current.start <= lastMerged.end) {
      // Merge by extending the end time
      lastMerged.end = new Date(Math.max(lastMerged.end.getTime(), current.end.getTime()));
    } else {
      // No overlap, add as new slot
      merged.push(current);
    }
  }

  return merged;
};
