/**
 * Students API
 */

import apiClient from './client';
import {
  StudentProfile,
  UpdateStudentDto,
  MembershipWithClub,
} from '@/types/api.types';

export const studentsApi = {
  /**
   * Get student profile by ID
   */
  getStudent: async (id: string): Promise<StudentProfile> => {
    return apiClient.get(`/students/${id}`);
  },

  /**
   * Update student profile
   */
  updateStudent: async (
    id: string,
    data: UpdateStudentDto
  ): Promise<StudentProfile> => {
    return apiClient.patch(`/students/${id}`, data);
  },

  /**
   * Get student memberships
   */
  getMemberships: async (studentId: string): Promise<MembershipWithClub[]> => {
    const response = await apiClient.get<{ memberships: MembershipWithClub[] }>(
      `/students/${studentId}/memberships`
    );
    return response.memberships;
  },
};
