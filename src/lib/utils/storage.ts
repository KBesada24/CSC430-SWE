/**
 * Local Storage Utilities
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'eagleconnect_auth_token',
  USER: 'eagleconnect_user',
} as const;

export const storage = {
  /**
   * Get auth token from storage
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Set auth token in storage
   */
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Remove auth token from storage
   */
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get user data from storage
   */
  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Set user data in storage
   */
  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Remove user data from storage
   */
  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Clear all auth data
   */
  clearAuth: (): void => {
    storage.removeToken();
    storage.removeUser();
  },
};
