import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireSelfAccess } from '@/lib/middleware/authorization.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * DELETE /api/events/[id]/rsvps/[studentId]
 * Cancels an RSVP (student can only cancel their own)
 * Requirements: 6.4
 */
async function cancelRsvpHandler(
  request: NextRequest,
  context?: { params: { id: string; studentId: string } }
) {
  const eventId = context!.params.id;
  const studentId = context!.params.studentId;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student can only cancel their own RSVP
  requireSelfAccess(studentId, authenticatedStudent.studentId);

  // Cancel RSVP
  const eventService = new EventService();
  await eventService.removeRsvp(eventId, studentId);

  return successResponse({
    message: 'RSVP canceled successfully',
  });
}

// Export with error handling middleware
export const DELETE = withErrorHandler(cancelRsvpHandler);
