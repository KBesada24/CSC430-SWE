/**
 * Authentication API
 */

import apiClient from './client';
import {
  RegisterDto,
  LoginResponse,
  StudentProfile,
} from '@/types/api.types';

export const authApi = {
  /**
   * Register a new student
   */
  register: async (data: RegisterDto): Promise<StudentProfile> => {
    return apiClient.post('/auth/register', data);
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },
};
