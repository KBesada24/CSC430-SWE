/**
 * Authentication Utilities
 */

import { storage } from './storage';
import apiClient from '../api/client';

export const auth = {
  /**
   * Initialize auth state from storage
   */
  init: () => {
    const token = storage.getToken();
    if (token) {
      apiClient.setAuthToken(token);
    }
  },

  /**
   * Set authentication token
   */
  setToken: (token: string) => {
    storage.setToken(token);
    apiClient.setAuthToken(token);
  },

  /**
   * Clear authentication
   */
  clearAuth: () => {
    storage.clearAuth();
    apiClient.clearAuthToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!storage.getToken();
  },
};
