import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * GET /api/events/[id]/rsvps
 * Retrieves list of attendees for an event
 * Requirements: 5.4
 */
async function getAttendeesHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const eventId = context!.params.id;

  const eventService = new EventService();
  const attendees = await eventService.getAttendees(eventId);

  return successResponse({
    attendees: attendees.map((attendee) => ({
      studentId: attendee.student_id,
      eventId: attendee.event_id,
      createdAt: attendee.created_at,
      student: {
        studentId: attendee.student.student_id,
        email: attendee.student.email,
        firstName: attendee.student.first_name,
        lastName: attendee.student.last_name,
      },
    })),
  });
}

/**
 * POST /api/events/[id]/rsvps
 * Creates an RSVP for authenticated student
 * Requirements: 6.3, 6.5
 */
async function createRsvpHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const eventId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Create RSVP
  const eventService = new EventService();
  const rsvp = await eventService.addRsvp(eventId, authenticatedStudent.studentId);

  return successResponse(
    {
      studentId: rsvp.student_id,
      eventId: rsvp.event_id,
      createdAt: rsvp.created_at,
    },
    201
  );
}

// Export with error handling middleware
export const GET = withErrorHandler(getAttendeesHandler);
export const POST = withErrorHandler(createRsvpHandler);
