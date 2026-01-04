/**
 * Type definitions for the Interview Scheduler application
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'candidate' | 'interviewer';
  timezone?: string;
  phone?: string;
  company?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  start: Date | string;
  end: Date | string;
}

export interface Availability {
  _id: string;
  userId: string | User;
  timeSlots: TimeSlot[];
  rawText?: string;
  inputMethod: 'structured' | 'freetext' | 'ai-parsed';
  parsedByAI: boolean;
  parsingConfidence?: number;
  validUntil: Date | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposedSlot extends TimeSlot {
  score?: number;
}

export interface Interview {
  _id: string;
  candidateId: string | User;
  interviewerId: string | User;
  proposedSlots: ProposedSlot[];
  selectedSlot?: TimeSlot;
  status: 'pending' | 'proposed' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
  interviewType?: string;
  duration: number;
  notes?: string;
  emailsSent: boolean;
  calendarInviteSent: boolean;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}

export interface AvailabilityFormData {
  userId: string;
  timeSlots?: TimeSlot[];
  rawText?: string;
  validUntil: string;
  notes?: string;
}

export interface InterviewMatchRequest {
  candidateId: string;
  interviewerId: string;
  duration?: number;
  interviewType?: string;
}

export interface InterviewConfirmRequest {
  interviewId: string;
  selectedSlotIndex: number;
  meetingLink?: string;
  location?: string;
  notes?: string;
}
