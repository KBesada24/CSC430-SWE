import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { ClubService } from '@/lib/services/club.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireClubAdmin } from '@/lib/middleware/authorization.middleware';
import { validateQueryParams, validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { paginatedResponse, successResponse } from '@/lib/utils/api-response';
import { eventFiltersSchema, createEventSchema } from '@/lib/validators/event.validator';

/**
 * GET /api/events
 * Retrieves paginated list of events with filters
 * Requirements: 6.1, 6.2, 9.3
 */
async function getEventsHandler(request: NextRequest) {
  // Parse and validate query parameters
  const queryParams = validateQueryParams(request, eventFiltersSchema);

  const eventService = new EventService();
  const result = await eventService.getAll(
    {
      clubId: queryParams.clubId,
      upcoming: queryParams.upcoming,
    },
    {
      page: queryParams.page,
      limit: queryParams.limit,
    }
  );

  return paginatedResponse(
    result.items.map((event) => ({
      eventId: event.event_id,
      title: event.title,
      eventDate: event.event_date,
      location: event.location,
      description: event.description,
      clubId: event.club_id,
      createdAt: event.created_at,
      club: {
        clubId: event.club.club_id,
        name: event.club.name,
        category: event.club.category,
      },
    })),
    result.pagination.total,
    result.pagination.page,
    result.pagination.limit
  );
}

/**
 * POST /api/events
 * Creates a new event (club admin only)
 * Requirements: 5.1, 5.5
 */
async function createEventHandler(request: NextRequest) {
  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Validate request body
  const validatedData = await validateRequest(request, createEventSchema);

  // Verify student is admin of the specified club
  await requireClubAdmin(validatedData.clubId, authenticatedStudent.studentId);

  // Create event
  const eventService = new EventService();
  const event = await eventService.create(validatedData);

  return successResponse(
    {
      eventId: event.event_id,
      title: event.title,
      eventDate: event.event_date,
      location: event.location,
      description: event.description,
      clubId: event.club_id,
      createdAt: event.created_at,
      club: {
        clubId: event.club.club_id,
        name: event.club.name,
        category: event.club.category,
      },
      attendeeCount: event.attendee_count,
    },
    201
  );
}

// Export with error handling middleware
export const GET = withErrorHandler(getEventsHandler);
export const POST = withErrorHandler(createEventHandler);
