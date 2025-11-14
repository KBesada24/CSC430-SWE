import { z } from 'zod';

/**
 * Validation schema for student registration
 * Requirements: 1.1, 8.1, 8.4
 */
export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
});

/**
 * Validation schema for student login
 * Requirements: 1.2, 8.1, 8.4
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Export types for use in API routes and services
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
