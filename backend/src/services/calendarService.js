import ics from 'ics';
import { format } from 'date-fns';

/**
 * Calendar Service
 * Generates .ics (iCalendar) files for interview invitations
 */

/**
 * Creates an .ics calendar event for an interview
 * @param {Object} interviewDetails - Interview information
 * @returns {string} .ics file content
 */
export const generateCalendarInvite = (interviewDetails) => {
  const {
    candidateName,
    candidateEmail,
    interviewerName,
    interviewerEmail,
    startTime,
    endTime,
    meetingLink,
    location,
    interviewType,
    notes,
  } = interviewDetails;

  // Convert dates to array format required by ics library
  const start = dateToArray(startTime);
  const end = dateToArray(endTime);

  // Calculate duration in minutes
  const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

  // Build event description
  let description = `Interview between ${candidateName} (Candidate) and ${interviewerName} (Interviewer)\\n\\n`;
  description += `Type: ${interviewType || 'Technical Interview'}\\n`;
  
  if (meetingLink) {
    description += `\\nMeeting Link: ${meetingLink}\\n`;
  }
  
  if (notes) {
    description += `\\nNotes: ${notes}\\n`;
  }

  description += `\\nThis is an automated calendar invite from Interview Scheduler.`;

  // Create event object
  const event = {
    start,
    end,
    title: `Interview: ${candidateName} & ${interviewerName}`,
    description,
    location: location || meetingLink || 'Virtual Meeting',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: {
      name: interviewerName,
      email: interviewerEmail,
    },
    attendees: [
      {
        name: candidateName,
        email: candidateEmail,
        rsvp: true,
        partstat: 'NEEDS-ACTION',
        role: 'REQ-PARTICIPANT',
      },
      {
        name: interviewerName,
        email: interviewerEmail,
        rsvp: true,
        partstat: 'ACCEPTED',
        role: 'REQ-PARTICIPANT',
      },
    ],
    alarms: [
      {
        action: 'display',
        description: 'Interview reminder',
        trigger: { minutes: 15, before: true },
      },
      {
        action: 'display',
        description: 'Interview starting soon',
        trigger: { minutes: 5, before: true },
      },
    ],
  };

  // Generate .ics file
  const { error, value } = ics.createEvent(event);

  if (error) {
    console.error('Error generating calendar invite:', error);
    throw new Error('Failed to generate calendar invite');
  }

  return value;
};

/**
 * Converts a JavaScript Date to array format for ics library
 * @param {Date} date - Date to convert
 * @returns {Array} [year, month, day, hour, minute]
 */
const dateToArray = (date) => {
  return [
    date.getFullYear(),
    date.getMonth() + 1, // ics library expects 1-12, not 0-11
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

/**
 * Formats a time slot for display in emails
 * @param {Date} start - Start time
 * @param {Date} end - End time
 * @returns {string} Formatted time slot string
 */
export const formatTimeSlot = (start, end) => {
  const dateStr = format(start, 'EEEE, MMMM d, yyyy');
  const startTimeStr = format(start, 'h:mm a');
  const endTimeStr = format(end, 'h:mm a');
  
  return `${dateStr} from ${startTimeStr} to ${endTimeStr}`;
};

/**
 * Generates a filename for the calendar invite
 * @param {string} candidateName - Candidate's name
 * @param {Date} startTime - Interview start time
 * @returns {string} Filename for .ics file
 */
export const generateCalendarFilename = (candidateName, startTime) => {
  const dateStr = format(startTime, 'yyyy-MM-dd');
  const safeName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  return `interview_${safeName}_${dateStr}.ics`;
};
