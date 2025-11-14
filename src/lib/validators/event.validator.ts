import { z } from 'zod';

/**
 * Validation schema for creating a new event
 * Requirements: 5.1, 5.5, 8.1, 8.4
 */
export const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(255, 'Event title must be less than 255 characters'),
  eventDate: z.string().datetime('Invalid date format. Expected ISO 8601 datetime string'),
  location: z.string().min(1, 'Location is required').max(255, 'Location must be less than 255 characters'),
  description: z.string().optional(),
  clubId: z.string().uuid('Invalid club ID format'),
}).refine(
  (data) => {
    // Validate that event date is in the future
    const eventDate = new Date(data.eventDate);
    return eventDate > new Date();
  },
  {
    message: 'Event date must be in the future',
    path: ['eventDate'],
  }
);

/**
 * Validation schema for updating an event
 * Requirements: 5.2, 5.5, 8.1, 8.4
 */
export const updateEventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(255, 'Event title must be less than 255 characters').optional(),
  eventDate: z.string().datetime('Invalid date format. Expected ISO 8601 datetime string').optional(),
  location: z.string().min(1, 'Location is required').max(255, 'Location must be less than 255 characters').optional(),
  description: z.string().optional(),
}).refine(
  (data) => {
    // Validate that event date is in the future if provided
    if (data.eventDate) {
      const eventDate = new Date(data.eventDate);
      return eventDate > new Date();
    }
    return true;
  },
  {
    message: 'Event date must be in the future',
    path: ['eventDate'],
  }
);

/**
 * Validation schema for event filters (query parameters)
 * Requirements: 6.1, 6.2, 8.1
 */
export const eventFiltersSchema = z.object({
  clubId: z.string().uuid('Invalid club ID format').optional(),
  upcoming: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Export types for use in API routes and services
export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
export type EventFilters = z.infer<typeof eventFiltersSchema>;
