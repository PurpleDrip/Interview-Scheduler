import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize SendGrid client for email notifications
 * Handles calendar invites and interview confirmations
 */
const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey || apiKey === 'SG.your-sendgrid-api-key-here') {
    console.warn('⚠ SendGrid API key not configured. Email functionality will be disabled.');
    return null;
  }

  sgMail.setApiKey(apiKey);
  console.log('✓ SendGrid configured successfully');
  return sgMail;
};

export const sendGridClient = initializeSendGrid();

/**
 * Gets the configured sender email and name
 */
export const getSenderInfo = () => ({
  email: process.env.SENDGRID_FROM_EMAIL || 'noreply@interviewscheduler.com',
  name: process.env.SENDGRID_FROM_NAME || 'Interview Scheduler',
});

export default sendGridClient;
