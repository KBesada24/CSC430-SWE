import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { ClubService } from '@/lib/services/club.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { updateEventSchema } from '@/lib/validators/event.validator';

/**
 * GET /api/events/[id]
 * Retrieves detailed event information
 * Requirements: 6.1
 */
async function getEventHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const eventId = context!.params.id;

  const eventService = new EventService();
  const event = await eventService.getById(eventId);

  return successResponse({
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
  });
}

/**
 * PATCH /api/events/[id]
 * Updates event information (club admin only)
 * Requirements: 5.2, 5.5
 */
async function updateEventHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const eventId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Get event to verify club admin
  const eventService = new EventService();
  const existingEvent = await eventService.getById(eventId);

  // Verify student is admin of the event's club
  const clubService = new ClubService();
  const isAdmin = await clubService.isAdmin(existingEvent.club_id, authenticatedStudent.studentId);
  if (!isAdmin) {
    throw new Error('You must be the club admin to update this event');
  }

  // Validate request body
  const validatedData = await validateRequest(request, updateEventSchema);

  // Update event
  const updatedEvent = await eventService.update(eventId, validatedData);

  return successResponse({
    eventId: updatedEvent.event_id,
    title: updatedEvent.title,
    eventDate: updatedEvent.event_date,
    location: updatedEvent.location,
    description: updatedEvent.description,
    clubId: updatedEvent.club_id,
    createdAt: updatedEvent.created_at,
    club: {
      clubId: updatedEvent.club.club_id,
      name: updatedEvent.club.name,
      category: updatedEvent.club.category,
    },
    attendeeCount: updatedEvent.attendee_count,
  });
}

/**
 * DELETE /api/events/[id]
 * Deletes an event (club admin only)
 * Requirements: 5.3
 */
async function deleteEventHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const eventId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Get event to verify club admin
  const eventService = new EventService();
  const existingEvent = await eventService.getById(eventId);

  // Verify student is admin of the event's club
  const clubService = new ClubService();
  const isAdmin = await clubService.isAdmin(existingEvent.club_id, authenticatedStudent.studentId);
  if (!isAdmin) {
    throw new Error('You must be the club admin to delete this event');
  }

  // Delete event
  await eventService.delete(eventId);

  return successResponse({
    message: 'Event deleted successfully',
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getEventHandler);
export const PATCH = withErrorHandler(updateEventHandler);
export const DELETE = withErrorHandler(deleteEventHandler);
