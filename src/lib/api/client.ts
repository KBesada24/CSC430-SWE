/**
 * API Client
 * Centralized HTTP client for making requests to the backend API
 */

import { ApiResponse, ApiError as ApiErrorType } from '@/types/api.types';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Client configuration
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
  }

  /**
   * Get default headers
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const errorData: ApiErrorType = await response.json();
        throw new ApiError(
          response.status,
          errorData.error.code,
          errorData.error.message,
          errorData.error.details
        );
      } else {
        throw new ApiError(
          response.status,
          'UNKNOWN_ERROR',
          `HTTP ${response.status}: ${response.statusText}`
        );
      }
    }

    if (isJson) {
      const data: ApiResponse<T> = await response.json();
      return data.data;
    }

    return {} as T;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...config,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'TIMEOUT', 'Request timeout');
        }
        throw new ApiError(500, 'NETWORK_ERROR', error.message);
      }

      throw new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }
}

// Create and export API client instance
const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

export default apiClient;
