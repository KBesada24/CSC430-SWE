/**
 * Statistics API
 */

import apiClient from './client';
import { PlatformStats, StudentStats } from '@/types/api.types';

export const statsApi = {
  /**
   * Get platform-wide statistics
   */
  getPlatformStats: async (): Promise<PlatformStats> => {
    return apiClient.get('/stats');
  },

  /**
   * Get student statistics
   */
  getStudentStats: async (studentId: string): Promise<StudentStats> => {
    return apiClient.get(`/stats/student/${studentId}`);
  },
};
