import { sendGridClient, getSenderInfo } from '../config/sendgrid.js';
import { generateCalendarInvite, formatTimeSlot, generateCalendarFilename } from './calendarService.js';

/**
 * Email Service
 * Handles sending interview notifications via SendGrid with calendar invites
 */

/**
 * Sends interview proposal email with multiple time slot options
 * @param {Object} emailData - Email details
 * @returns {Promise<boolean>} Success status
 */
export const sendInterviewProposalEmail = async (emailData) => {
  const {
    candidateName,
    candidateEmail,
    interviewerName,
    interviewerEmail,
    proposedSlots,
    interviewType,
  } = emailData;

  if (!sendGridClient) {
    console.warn('SendGrid not configured. Skipping email send.');
    return false;
  }

  const senderInfo = getSenderInfo();

  // Format proposed slots for email
  const slotsHtml = proposedSlots
    .map((slot, index) => {
      const formattedSlot = formatTimeSlot(slot.start, slot.end);
      return `<li><strong>Option ${index + 1}:</strong> ${formattedSlot}</li>`;
    })
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .time-slots { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
        .time-slots ul { list-style: none; padding: 0; }
        .time-slots li { padding: 10px 0; border-bottom: 1px solid #eee; }
        .time-slots li:last-child { border-bottom: none; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Interview Scheduled</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${candidateName}</strong>,</p>
          
          <p>Great news! <strong>${interviewerName}</strong> would like to schedule a ${interviewType || 'technical'} interview with you.</p>
          
          <p>Based on both of your availability, we've identified the following optimal time slots:</p>
          
          <div class="time-slots">
            <ul>
              ${slotsHtml}
            </ul>
          </div>
          
          <p>Please review these options and confirm your preferred time slot. A calendar invite will be sent once confirmed.</p>
          
          <p>If none of these times work for you, please update your availability and we'll find alternative slots.</p>
          
          <p>Best regards,<br>
          <strong>Interview Scheduler Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from Interview Scheduler. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hello ${candidateName},

Great news! ${interviewerName} would like to schedule a ${interviewType || 'technical'} interview with you.

Based on both of your availability, we've identified the following optimal time slots:

${proposedSlots.map((slot, i) => `Option ${i + 1}: ${formatTimeSlot(slot.start, slot.end)}`).join('\n')}

Please review these options and confirm your preferred time slot.

Best regards,
Interview Scheduler Team
  `;

  try {
    const msg = {
      to: [candidateEmail, interviewerEmail],
      from: {
        email: senderInfo.email,
        name: senderInfo.name,
      },
      subject: `Interview Scheduled: ${candidateName} & ${interviewerName}`,
      text: textContent,
      html: htmlContent,
    };

    await sendGridClient.send(msg);
    console.log(`✓ Interview proposal email sent to ${candidateEmail} and ${interviewerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending proposal email:', error.message);
    return false;
  }
};

/**
 * Sends interview confirmation email with calendar invite
 * @param {Object} emailData - Email details including confirmed slot
 * @returns {Promise<boolean>} Success status
 */
export const sendInterviewConfirmationEmail = async (emailData) => {
  const {
    candidateName,
    candidateEmail,
    interviewerName,
    interviewerEmail,
    confirmedSlot,
    meetingLink,
    location,
    interviewType,
    notes,
  } = emailData;

  if (!sendGridClient) {
    console.warn('SendGrid not configured. Skipping email send.');
    return false;
  }

  const senderInfo = getSenderInfo();
  const formattedSlot = formatTimeSlot(confirmedSlot.start, confirmedSlot.end);

  // Generate calendar invite
  const calendarInvite = generateCalendarInvite({
    candidateName,
    candidateEmail,
    interviewerName,
    interviewerEmail,
    startTime: confirmedSlot.start,
    endTime: confirmedSlot.end,
    meetingLink,
    location,
    interviewType,
    notes,
  });

  const calendarFilename = generateCalendarFilename(candidateName, confirmedSlot.start);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
        .details p { margin: 10px 0; }
        .meeting-link { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Interview Confirmed</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          
          <p>Your interview has been confirmed! Here are the details:</p>
          
          <div class="details">
            <p><strong>Candidate:</strong> ${candidateName}</p>
            <p><strong>Interviewer:</strong> ${interviewerName}</p>
            <p><strong>Type:</strong> ${interviewType || 'Technical Interview'}</p>
            <p><strong>Time:</strong> ${formattedSlot}</p>
            ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}" class="meeting-link">Join Meeting</a></p>` : ''}
            ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <p>A calendar invite (.ics file) is attached to this email. Please add it to your calendar.</p>
          
          <p>You will receive a reminder 15 minutes before the interview.</p>
          
          <p>Best of luck!<br>
          <strong>Interview Scheduler Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from Interview Scheduler.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Interview Confirmed

Candidate: ${candidateName}
Interviewer: ${interviewerName}
Type: ${interviewType || 'Technical Interview'}
Time: ${formattedSlot}
${meetingLink ? `Meeting Link: ${meetingLink}` : ''}
${location ? `Location: ${location}` : ''}
${notes ? `Notes: ${notes}` : ''}

A calendar invite is attached to this email. Please add it to your calendar.

Best of luck!
Interview Scheduler Team
  `;

  try {
    const msg = {
      to: [candidateEmail, interviewerEmail],
      from: {
        email: senderInfo.email,
        name: senderInfo.name,
      },
      subject: `✓ Interview Confirmed: ${formattedSlot}`,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          content: Buffer.from(calendarInvite).toString('base64'),
          filename: calendarFilename,
          type: 'text/calendar',
          disposition: 'attachment',
        },
      ],
    };

    await sendGridClient.send(msg);
    console.log(`✓ Interview confirmation email sent with calendar invite to ${candidateEmail} and ${interviewerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
    return false;
  }
};
