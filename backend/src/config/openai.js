import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize OpenAI client for AI-powered availability parsing
 * Uses GPT-4 for accurate natural language understanding
 */
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Validates that OpenAI API key is configured
 */
export const validateOpenAIConfig = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured in environment variables');
  }
  console.log('✓ OpenAI API configured successfully');
};

export default openaiClient;
