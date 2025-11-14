import { z } from 'zod';

/**
 * Validation schema for updating student profile
 * Requirements: 1.4, 8.1, 8.4
 */
export const updateStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters').optional(),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters').optional(),
});

// Export type for use in API routes and services
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;
