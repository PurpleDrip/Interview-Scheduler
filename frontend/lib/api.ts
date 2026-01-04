import type {
  User,
  Availability,
  Interview,
  ApiResponse,
  AvailabilityFormData,
  InterviewMatchRequest,
  InterviewConfirmRequest,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * API Client for Interview Scheduler Backend
 */

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || { message: 'Request failed' },
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  // User endpoints
  async createUser(userData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/api/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/api/users/email/${email}`);
  }

  async getUsersByRole(role: 'candidate' | 'interviewer'): Promise<ApiResponse<{ users: User[]; count: number }>> {
    return this.request(`/api/users/role/${role}`);
  }

  // Availability endpoints
  async submitAvailability(data: AvailabilityFormData): Promise<ApiResponse<{ availability: Availability; message?: string }>> {
    return this.request('/api/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAvailabilityByUser(userId: string): Promise<ApiResponse<{ availability: Availability[]; count: number }>> {
    return this.request(`/api/availability/user/${userId}`);
  }

  async getAvailabilityById(id: string): Promise<ApiResponse<{ availability: Availability }>> {
    return this.request(`/api/availability/${id}`);
  }

  async updateAvailability(id: string, data: Partial<AvailabilityFormData>): Promise<ApiResponse<{ availability: Availability }>> {
    return this.request(`/api/availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAvailability(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/api/availability/${id}`, {
      method: 'DELETE',
    });
  }

  // Interview endpoints
  async matchInterviewSlots(data: InterviewMatchRequest): Promise<ApiResponse<{ interview: Interview; message?: string }>> {
    return this.request('/api/interview/match', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmInterview(data: InterviewConfirmRequest): Promise<ApiResponse<{ interview: Interview; message?: string }>> {
    return this.request('/api/interview/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInterviewById(id: string): Promise<ApiResponse<{ interview: Interview }>> {
    return this.request(`/api/interview/${id}`);
  }

  async getInterviewsByUser(userId: string): Promise<ApiResponse<{ interviews: Interview[]; count: number }>> {
    return this.request(`/api/interview/user/${userId}`);
  }

  async cancelInterview(id: string, userId: string, reason?: string): Promise<ApiResponse<{ interview: Interview; message?: string }>> {
    return this.request(`/api/interview/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ userId, reason }),
    });
  }
}

export const api = new ApiClient(API_URL);
export default api;
