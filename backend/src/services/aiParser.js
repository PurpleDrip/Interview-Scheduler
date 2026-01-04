import openaiClient from '../config/openai.js';

/**
 * AI-powered service to parse unstructured availability text
 * Converts natural language into structured time slots
 */

/**
 * Parses free-text availability using OpenAI GPT
 * @param {string} availabilityText - Natural language availability description
 * @param {string} timezone - User's timezone (default: UTC)
 * @returns {Object} Parsed time slots and confidence score
 */
export const parseAvailabilityText = async (availabilityText, timezone = 'UTC') => {
  try {
    const currentDate = new Date().toISOString();
    
    const systemPrompt = `You are an expert at parsing availability schedules from natural language text.
Your task is to extract time slots from user input and convert them to structured data.

Current date/time: ${currentDate}
User timezone: ${timezone}

Rules:
1. Parse all mentioned time slots into start and end times
2. Convert relative dates (e.g., "Monday", "next week") to absolute ISO 8601 dates
3. Handle various time formats (12h, 24h, AM/PM)
4. If duration is mentioned without end time, calculate the end time
5. Default to 1-hour slots if only start time is given
6. Return confidence score (0-1) based on clarity of input

Return ONLY valid JSON in this exact format:
{
  "timeSlots": [
    {
      "start": "ISO 8601 datetime string",
      "end": "ISO 8601 datetime string"
    }
  ],
  "confidence": 0.95,
  "interpretation": "Brief explanation of what was parsed"
}`;

    const userPrompt = `Parse this availability text:\n\n"${availabilityText}"`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Extract JSON from response (handles cases where AI adds explanation)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate parsed structure
    if (!parsed.timeSlots || !Array.isArray(parsed.timeSlots)) {
      throw new Error('Invalid time slots structure from AI');
    }

    // Convert string dates to Date objects and validate
    const validatedSlots = parsed.timeSlots.map((slot) => {
      const start = new Date(slot.start);
      const end = new Date(slot.end);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format in parsed slots');
      }

      if (end <= start) {
        throw new Error('End time must be after start time');
      }

      return { start, end };
    });

    return {
      timeSlots: validatedSlots,
      confidence: parsed.confidence || 0.5,
      interpretation: parsed.interpretation || 'Parsed successfully',
      parsedByAI: true,
    };
  } catch (error) {
    console.error('AI parsing error:', error.message);
    
    // Return error with fallback suggestion
    return {
      timeSlots: [],
      confidence: 0,
      interpretation: `Failed to parse: ${error.message}. Please use structured time picker.`,
      parsedByAI: false,
      error: error.message,
    };
  }
};

/**
 * Validates if parsed time slots are reasonable
 * @param {Array} timeSlots - Array of time slot objects
 * @returns {Object} Validation result
 */
export const validateParsedSlots = (timeSlots) => {
  const now = new Date();
  const maxFutureMonths = 6;
  const maxFutureDate = new Date();
  maxFutureDate.setMonth(maxFutureDate.getMonth() + maxFutureMonths);

  const issues = [];

  for (const slot of timeSlots) {
    // Check if slot is in the past
    if (slot.start < now) {
      issues.push(`Time slot ${slot.start.toISOString()} is in the past`);
    }

    // Check if slot is too far in the future
    if (slot.start > maxFutureDate) {
      issues.push(`Time slot ${slot.start.toISOString()} is more than ${maxFutureMonths} months in the future`);
    }

    // Check slot duration (should be between 15 min and 8 hours)
    const durationMs = slot.end - slot.start;
    const durationMinutes = durationMs / (1000 * 60);
    
    if (durationMinutes < 15) {
      issues.push(`Time slot is too short (${durationMinutes} minutes)`);
    }
    
    if (durationMinutes > 480) {
      issues.push(`Time slot is too long (${durationMinutes} minutes)`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};
