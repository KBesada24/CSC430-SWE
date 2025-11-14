import { z } from 'zod';

/**
 * Validation schema for creating a new club
 * Requirements: 4.1, 8.1, 8.4
 */
export const createClubSchema = z.object({
  name: z.string().min(1, 'Club name is required').max(255, 'Club name must be less than 255 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category must be less than 100 characters'),
  coverPhotoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

/**
 * Validation schema for updating a club
 * Requirements: 4.2, 8.1, 8.4
 */
export const updateClubSchema = z.object({
  name: z.string().min(1, 'Club name is required').max(255, 'Club name must be less than 255 characters').optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category must be less than 100 characters').optional(),
  coverPhotoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

/**
 * Validation schema for club filters (query parameters)
 * Requirements: 2.1, 2.2, 2.3, 8.1
 */
export const clubFiltersSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

/**
 * Validation schema for membership status updates
 * Requirements: 3.2, 4.4, 8.1
 */
export const updateMembershipStatusSchema = z.object({
  status: z.enum(['active', 'rejected'], {
    message: 'Status must be either "active" or "rejected"',
  }),
});

/**
 * Validation schema for membership status filter
 * Requirements: 4.3, 8.1
 */
export const membershipStatusFilterSchema = z.object({
  status: z.enum(['pending', 'active', 'rejected']).optional(),
});

// Export types for use in API routes and services
export type CreateClubDto = z.infer<typeof createClubSchema>;
export type UpdateClubDto = z.infer<typeof updateClubSchema>;
export type ClubFilters = z.infer<typeof clubFiltersSchema>;
export type UpdateMembershipStatusDto = z.infer<typeof updateMembershipStatusSchema>;
export type MembershipStatusFilter = z.infer<typeof membershipStatusFilterSchema>;
